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

async function getLastReleaseDateByTag(releaseTag) {
  const tagsSpinner = ora("loading list of tags...").start()
  const tags = await octokit.paginate(`GET /repos/${owner}/${repo}/tags`, {
    owner,
    repo,
    per_page: 100
  })
  tagsSpinner.succeed()

  const targetTag = tags.find((tag) => tag.name === releaseTag);
  if (!targetTag) {
    throw new Error("Could not find tag");
  }

  const { data: commit } = await octokit.repos.getCommit({
    owner,
    repo,
    ref: targetTag.commit.sha,
  });

  return new Date(commit.commit.committer.date);
}


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
    const commitDate = await getLastReleaseDateByTag(TAG)
    await getPRsBeforeDate(commitDate)

    ora("Successfully loaded list of PRs before tag").succeed()
  } catch (error) {
    const error_message = "Failed to get the list of PRs before tag"
    ora(error_message).fail()
    throw new Error(error);
  }
})()