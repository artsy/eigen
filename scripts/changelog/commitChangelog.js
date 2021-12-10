// @ts-check
"use strict"
const { spawnSync } = require("child_process")
const updatePlatfromChangeLog = require("./generatePlatformChangelog").updatePlatfromChangeLog
const Octokit = require("@octokit/rest")
const ora = require("ora")

const DEFAULT_CHANGELOG_BRANCH = "update-changelog"

const octokit = new Octokit({ auth: process.env.CHANGELOG_GITHUB_TOKEN_KEY })

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
    exec(`git checkout ${DEFAULT_CHANGELOG_BRANCH}`)
    exec(`git reset main --hard`)
  } catch (_) {
    exec(`git checkout -b ${DEFAULT_CHANGELOG_BRANCH}`)
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
  exec(`git add CHANGELOG/android-changelog.md`)
  exec(`git add CHANGELOG/ios-changelog.md`)
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
  const res = await octokit.pulls.list({
    repo: "eigen",
    state: "open",
    owner: "artsy",
  })
  return res.data.some((pr) => pr.head.ref === DEFAULT_CHANGELOG_BRANCH)
}

const createAndMergePullRequest = async () => {
  const logger = ora("creating pull request").start()

  // Create the PR
  const res = await octokit.pulls.create({
    repo: "eigen",
    head: DEFAULT_CHANGELOG_BRANCH,
    owner: "artsy",
    base: "main",
    title: "Update Changelog ✍️",
    body: "This is an automatic PR to update the changelog ✍️",
  })

  // Add Label to the PR
  await octokit.issues.addLabels({
    repo: "eigen",
    issue_number: res.data.number,
    owner: "artsy",
    labels: ["Changelog Updater", "Merge On Green"],
  })

  logger.succeed()
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
  await createAndMergePullRequest()
}

main()
