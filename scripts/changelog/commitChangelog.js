// @ts-check
"use strict"
const { execSync, spawnSync } = require("child_process")
const updatePlatfromChangeLog = require("./generatePlatformChangelog").updatePlatfromChangeLog
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

const main = async () => {
  // Make sure we are on a clean branch and checkout to it
  forceCheckout()
  // Run the changelog updater
  await Promise.all([updatePlatfromChangeLog("android", "beta"), updatePlatfromChangeLog("ios", "beta")])

  // Check if we have any changes in the changelog
  const hasChanges = hasNoChanges()
  // If no changes were found, no further action needed, quit
  if (hasChanges) {
    ora("no changes were made, no further action needed")
    return
  }
  // Commit and push changes to the update changelog branch
  commitAndPushChanges()
  // Check if there is an open PR already
  // If yes, no further action needed, quit
  // Create a pull request and merge it
}

main()