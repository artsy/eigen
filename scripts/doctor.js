#!/usr/bin/env node

/**
 * This script runs some trivial checks to identify possible
 * issues related to the project configuration and suggest ways to solve them.
 * So far, this script does 2 main things.
 * - Check if the environment variables match the ones in S3
 * - Verify if there is a version mismath in node modules
 */

const { spawnSync } = require("child_process")
const chalk = require("chalk")
const checkDependencies = require("check-dependencies")
const fs = require("fs")

const exec = (command, cwd) => {
  const task = spawnSync(command, { shell: true, cwd })
  if (task.status != 0) {
    throw new Error(task.stderr.toString())
  }
  return task.stdout.toString()
}

const NO = (message, suggestion) => {
  console.log(`🔴 ${message}`)
  if (suggestion) console.log(`└──> ${suggestion}`)
}
const YES = (message) => console.log(`🟢 ${message}`)

const checkEnvVariablesAreUpToDate = () => {
  exec("touch .env.temp")
  exec("aws s3 cp s3://artsy-citadel/dev/.env.eigen .env.temp")

  const updatedEnv = fs.readFileSync("./.env.temp", "utf8").toString()
  let localEnv = ""
  try {
    localEnv = fs.readFileSync("./.env.shared", "utf8").toString()
  } catch (e) {
    // in that case, we don't even have a `.env.shared`.
    localEnv = "nope"
  }

  if (updatedEnv !== localEnv) {
    NO("Your .env.shared file does not match the one in AWS.", `Please run ${chalk.green("make artsy")}.`)
  } else {
    YES("Your env file seems to be valid.")
  }
  exec("rm .env.temp")
}

const checkNodeDependencies = async () => {
  const res = await checkDependencies()

  if (res.error.length > 0) {
    // Some dependencies do not match the specified version
    NO("Your dependencies are out of sync.", `Invoke ${chalk.green("make install")} to install missing dependencies.`)
  } else {
    YES("Your dependencies match the ones specifed in package.json.")
  }
}

const main = async () => {
  checkEnvVariablesAreUpToDate()
  // Check if any of the installed npm packages does not match the version in package.json
  await checkNodeDependencies()
  /// add here
}

main()
