#!/usr/bin/env node
/**
 * This file is used in CI to parse the list of merged pull requests
 * since the last public release per platform and get the changelogs for each one
 */

const Octokit = require("@octokit/rest");
const compact = require("lodash/compact");
const ora = require("ora");

const octokit = new Octokit({ auth: process.env.GH_TOKEN });


const owner = "artsy";
const repo = "eigen";


const TAG = "ios-6.9.2-2021.05.22.06-submission"

const isMergedAfter = (mergeDate, commitDate) => mergeDate !== null && new Date(mergeDate) > commitDate

/**
 * @param {string} platform
 */
async function getLastReleaseCommitDate(platform) {
  const tagsSpinner = ora("loading list of tags...").start()
  const tags = await octokit.paginate(`GET /repos/${owner}/${repo}/tags`, {
    owner,
    repo,
    per_page: 100
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
    throw new Error(`Could not find tag on ${platform}`);
  }

  ora(`last submission tag on ${platform}: ${targetTag.name}`).succeed()

  const { data: commit } = await octokit.repos.getCommit({
    owner,
    repo,
    ref: targetTag.commit.sha,
  });

  return new Date(commit.commit.committer.date);
}


/**
 * @param {Date} commitDate
 */
async function getPRsBeforeDate(commitDate) {
  const prsSpinner = ora("loading list of prs...").start()
  const prs = await octokit.paginate(`GET /repos/${owner}/${repo}/pulls`, {
    owner,
    repo,
    state: "closed",
    sort: "updated",
    direction: "desc",
    per_page: 20,
  }, (response, done) => {
      // Bail when some of the PRs were merged before the tag
      if (response.data.find((pr) =>
         isMergedAfter(pr.merged_at, commitDate)
      )) {
        return response.data
      }
      done();
    }
  )

  const filteredPRs = compact(prs).filter((pr) => isMergedAfter(pr.merged_at, commitDate))
  prsSpinner.succeed()

  return filteredPRs
}



(async function() {
  try {
    const commitDate = await getLastReleaseCommitDate("ios")
    await getPRsBeforeDate(commitDate)

    ora("Successfully loaded list of PRs before tag").succeed()
  } catch (error) {
    const error_message = "Failed to get the list of PRs before tag"
    ora(error_message).fail()
    throw new Error(error);
  }
})()