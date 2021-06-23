// @ts-check
"use strict"
const { execSync, spawnSync } = require("child_process")
const updatePlatfromChangeLog = require("./generatePlatformChangelog").updatePlatfromChangeLog
const Octokit = require("@octokit/rest")
const ora = require("ora")

const DEFAULT_CHANGELOG_BRANCH = "update-changelog"


/**
 * @param {string} command
 */
const exec = (command) => {
  const task = spawnSync(command, { shell: true })
  if (task.status != 0) {
    console.log(task.stderr.toString())
  }
  return task.stdout.toString()
}

/**
 * Checks out the branch, creating it if it doesn't already exist
 */
const forceCheckout = () => {
  const logger = ora("force checkout").start()
  try {
    execSync(`git checkout ${DEFAULT_CHANGELOG_BRANCH}}`)
    execSync(`git reset master --hard`)
  } catch (_) {
    execSync(`git checkout -b ${DEFAULT_CHANGELOG_BRANCH}`)
  } finally {
    logger.succeed()
  }
}

/**
 * Checks if no file is changed
 */
const hasNoChanges = () => {
  // @ts-ignore
  return exec("git status --porcelain") === ""
}

/**
 * Commit and push changes
 */
const commitAndPushChanges = () => {
  const logger = ora("commiting and pushing changes").start()
  exec(`git add -A`)
  const result = spawnSync("git", ["commit", "-m", "Update Changelog"])
  if (result.status !== 0) {
    logger.fail()
    process.exit(1)
  }
  exec(`git push origin ${DEFAULT_CHANGELOG_BRANCH} --force --no-verify`)
  logger.succeed()
}

/**
 * Check if an open pull request already exists
 */
const pullRequestAlreadyExists = async () => {
  const octokit = new Octokit({ auth: process.env.CHANGELOG_GITHUB_TOKEN_KEY})
  const res = await octokit.pulls.list({
    repo: "eigen",
    state: "open",
    owner: "artsy"
  })
  return res.data.some((pr) => pr.head.ref === DEFAULT_CHANGELOG_BRANCH)
}

const main = async () => {
  // Make sure we are on a clean branch and checkout to it
  forceCheckout()
  // Run the changelog updater
  await Promise.all([updatePlatfromChangeLog("android", "beta"), updatePlatfromChangeLog("ios", "beta")])

  // Check if we have any changes in the changelog
  // If no changes were found, no further action needed, quit
  if (hasNoChanges()) {
    ora("no changes were made, no further action needed")
    return
  }
  // Otherwise, Commit and push changes to the update changelog branch
  commitAndPushChanges()
  // Check if there is an open PR already
  // If yes, no further action needed, quit
  if (await pullRequestAlreadyExists()) {
    ora("there is already an open pull request, no further action needed")
    return
  }
  // Otherwise, Create a pull request and merge it
}

main()