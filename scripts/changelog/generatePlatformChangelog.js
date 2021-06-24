#!/usr/bin/env node

// @ts-check
"use strict"

/**
 * This file is used in CI to parse the list of merged pull requests
 * since the last public release per platform and get the changelogs for each one
 */
const { ArgumentParser } = require("argparse")
const Octokit = require("@octokit/rest")
const compact = require("lodash/compact")
const fs = require("fs")
const parsePRDescription = require("./parsePRDescription").parsePRDescription
const ora = require("ora")
const prettier = require("prettier")
const appVersion = require("../../app.json").version

const octokit = new Octokit({ auth: process.env.GH_TOKEN })

const owner = "artsy"
const repo = "eigen"

const parser = new ArgumentParser({})

parser.add_argument("-p", "--platform", {
  help: `select destination platform ("android" or "ios")`,
})

const parsedArgs = parser.parse_args()

if (parsedArgs.platform !== "android" && parsedArgs.platform !== "ios") {
  console.error(`plaform needs to be either "android" or "ios"`)
  process.exit(1)
}

updatePlatfromChangeLog(parsedArgs.platform)

/**
 * @param {string | null} mergeDate Date when the commit was merged
 * @param {Date} lastReleaseCommitDate Last release commit date
 */
const isMergedAfter = (mergeDate, lastReleaseCommitDate) =>
  mergeDate !== null && new Date(mergeDate) > lastReleaseCommitDate

/**
 * @param {"ios" | "android"} platform
 */
async function getLastReleaseCommitDate(platform) {
  const tagsSpinner = ora("loading list of tags...").start()
  const tags = await octokit.paginate(`GET /repos/${owner}/${repo}/tags`, {
    owner,
    repo,
    per_page: 100,
  })
  tagsSpinner.succeed()

  let targetTag
  if (platform === "ios") {
    // ios submitted builds have this format
    // ios-6.9.2-2021.05.22.06-submission
    targetTag = tags.find((tag) => tag.name.match(/^ios-.*submission$/))
  } else if (platform === "android") {
    // android submitted builds have this format
    // android-6.9.2-2021.05.22.06-submission
    targetTag = tags.find((tag) => tag.name.match(/^android-.*submission$/))
  }

  if (!targetTag) {
    console.error(`Could not find tag on ${platform}`)
    process.exit(1)
  }

  ora(`last submission tag on ${platform}: ${targetTag.name}`).succeed()

  const { data: commit } = await octokit.repos.getCommit({
    owner,
    repo,
    ref: targetTag.commit.sha,
  })

  return new Date(commit.commit.committer.date)
}

/**
 * @param {Date} commitDate
 */
async function getPRsBeforeDate(commitDate) {
  const prsSpinner = ora("loading list of prs...").start()
  const prs = await octokit.paginate(
    `GET /repos/${owner}/${repo}/pulls`,
    {
      owner,
      repo,
      state: "closed",
      sort: "updated",
      direction: "desc",
      per_page: 20,
    },
    (/** @type {{ data: import('@octokit/rest').PullsGetResponse[]; }} */ response, /** @type {() => void} */ done) => {
      // Bail when some of the PRs were merged before the tag
      if (response.data.find((pr) => isMergedAfter(pr.merged_at, commitDate))) {
        return response.data
      }
      done()
    }
  )

  const filteredPRs = compact(prs).filter((pr) => isMergedAfter(pr.merged_at, commitDate))
  prsSpinner.succeed()

  return filteredPRs
}

/**
 * @param {import('@octokit/rest').PullsGetResponse[]} prs List of merged pull requests
 */
function getCombinedChangeLog(prs) {
  const changeLog = {
    androidUserFacingChanges: [],
    crossPlatformUserFacingChanges: [],
    devChanges: [],
    iOSUserFacingChanges: [],
  }

  prs
    .map((pr) => parsePRDescription(pr.body))
    .filter((parseResult) => parseResult.type === "changes")
    .map((parseResult) => {
      for (const entry of Object.keys(changeLog)) {
        // @ts-ignore
        changeLog[entry] = changeLog[entry].concat(parseResult[entry])
      }
    })

  return changeLog
}

/**
 * @param {"android" | "ios"} platform
 * @param {import("./changelog-types").ParseResultChanges} changelog
 */
function generatePlatformChangelog(platform, changelog) {
  const spinner = ora("Generating platform specific changelog")

  const changelogFilePath = `./CHANGELOG/${platform}-changelog.md`
  let fileContent = fs.readFileSync(changelogFilePath, "utf8").toString()

  const regex = /## Released Changes/

  if (!fileContent.match(regex)) {
    // tslint:disable-next-line
    console.error(`Can't find 'Released Changes' section in the ${platform} template file`)
    spinner.fail()
    process.exit(1)
  }

  const platformSpecificChanges = getPlaformSpecificChangeLog(platform, changelog)
  fileContent = fileContent.replace(regex, platformSpecificChanges)
  fileContent = prettier.format(fileContent, { parser: "markdown" })

  fs.writeFileSync(changelogFilePath, fileContent, "utf8")
}

/**
 * @param {"android" | "ios"} platform
 * @param {import("./changelog-types").ParseResultChanges} changelog
 * @returns {string}
 * @example
 * ### 6.9.2
  - Status: **Released**
  - Build tag: **${commitTag}**
  - App store submission date: **Fri Jun 04 2021 15:48:24 GMT+0200 (Central European Summer Time)**
  - Changelog:
    - User facing changes:
      - Made button bigger
    - Dev changes:
      - Fixed rerendering issues
 *
 */
function getPlaformSpecificChangeLog(platform, changelog) {
  let changeLogMD = `
## Released Changes

### v${appVersion}

- Status: **Released**
- App store submission date: **${new Date().toString()}**
- Changelog:
`
  let userFacingChanges = changelog.crossPlatformUserFacingChanges
  if (platform === "android") {
    userFacingChanges = userFacingChanges.concat(changelog.androidUserFacingChanges)
  } else if (platform === "ios") {
    userFacingChanges = userFacingChanges.concat(changelog.iOSUserFacingChanges)
  }

  /**
   * Fill in the user facing changes if any are available
   */
  if (userFacingChanges.length > 0) {
    changeLogMD = `${changeLogMD}
  - User facing changes:
    - ${userFacingChanges.join("\n    - ")}
`
  }

  /**
   * Fill in the dev changes if any are available
   */
  if (changelog.devChanges.length > 0) {
    changeLogMD = `${changeLogMD}
  - Dev changes:
    - ${changelog.devChanges.join("\n    - ")}
`
  }

  return changeLogMD
}

/**
 * @param {"android" | "ios"} platform
 */
async function updatePlatfromChangeLog(platform) {
  try {
    const commitDate = await getLastReleaseCommitDate(platform)
    const prs = await getPRsBeforeDate(commitDate)
    const changelog = getCombinedChangeLog(prs)
    generatePlatformChangelog(platform, changelog)
    ora("Successfully loaded list of PRs before tag").succeed()
  } catch (error) {
    throw new Error(error)
  }
}

module.exports = {
  isMergedAfter,
  getLastReleaseCommitDate,
  getPRsBeforeDate,
  getCombinedChangeLog,
  getPlaformSpecificChangeLog,
}
