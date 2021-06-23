// @ts-check
"use strict"
const { execSync } = require("child_process")
const ora = require("ora")

const DEFAULT_CHANGELOG_BRANCH = "update-changelog"

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

const main = async () => {
  // Make sure we are on a clean branch and checkout to it
  forceCheckout()
  // Run the changelog updater
  // Check if we have any changes in the changelog
  // If yes, no further action neeeded, quit
  // Commit and push changes to the update changelog branch
  // Check if there is an open PR already
  // If yes, no further action needed, quit
  // Create a pull request and merge it
}
