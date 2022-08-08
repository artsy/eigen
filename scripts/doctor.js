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
const g = (text) => chalk.bold.green(text)
const r = (text) => chalk.bold.red(text)

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
    NO(`Your ${r`env file`} does not match the one in AWS.`, `Run ${g`yarn setup:artsy`}.`)
  } else {
    YES(`Your ${g`env file`} seems to be valid.`)
  }
  exec("rm .env.temp")
}

const checkNodeExists = () => {
  try {
    exec("node --version")
    YES(`Your ${g`node`} is ready to go.`)
  } catch (e) {
    NO(`You don't have ${r`node`}.`, `Install ${g`node`} first.`)
  }
}

const checkYarnExists = () => {
  try {
    exec("yarn --version")
    YES(`Your ${g`yarn`} is ready to go.`)
  } catch (e) {
    NO(`You don't have ${r`yarn`}.`, `Install ${g`yarn`} first.`)
  }
}

const checkRubyExists = () => {
  try {
    exec("ruby --version")
    YES(`Your ${g`ruby`} is ready to go.`)
  } catch (e) {
    NO(`You don't have ${r`ruby`}.`, `Install ${g`ruby`} first.`)
  }
}

const checkBundlerExists = () => {
  try {
    exec("bundle --version")
    YES(`Your ${g`bundler`} is ready to go.`)
  } catch (e) {
    NO(`You don't have ${r`bundler`}.`, `Install ${g`bundler`} first.`)
  }
}

const checkBundlerDependenciesAreUpToDate = () => {
  try {
    exec("bundle check")
    YES(`Your ${g`bundler dependencies`} are ready to go.`)
  } catch (e) {
    NO(
      `Your ${r`bundle dependencies`} are out of sync.`,
      `Run ${g`yarn install:all`} or ${g`bundle install`} first.`
    )
  }
}

const checkNodeDependenciesAreUpToDate = async () => {
  const res = await checkDependencies()

  if (res.error.length > 0) {
    NO(
      `Your ${r`node dependencies`} are out of sync.`,
      `Run ${g`yarn install:all`} or ${g`yarn install`} first.`
    )
  } else {
    YES(`Your ${g`node dependencies`} match the ones specifed in package.json.`)
  }
}

const checkPodDependenciesAreUpToDate = () => {
  try {
    exec("bundle exec pod check")
    YES(`Your ${g`pod dependencies`} are ready to go.`)
  } catch (e) {
    NO(
      `Your ${r`pod dependencies`} are out of sync.`,
      `Run ${g`yarn install:all`} or ${g`bundle exec pod install`} first.`
    )
  }
}

const checkDetectSecretsExists = () => {
  try {
    exec("detect-secrets-hook --version")
    YES(`Your ${g`detect-secrets`} is ready to go.`)
  } catch (e) {
    NO(
      `Your ${r`detect-secrets`} is missing or not linked.`,
      `Run ${g`yarn install:all`} or ${g`pip install -r requirements.txt`} to install, and then make sure it's in your $PATH.`
    )
  }
}

const main = async () => {
  checkEnvVariablesAreUpToDate()

  checkNodeExists()
  checkYarnExists()
  checkRubyExists()
  checkBundlerExists()

  checkBundlerDependenciesAreUpToDate()
  await checkNodeDependenciesAreUpToDate()
  // checkPodDependenciesAreUpToDate() // this is broken right now.. pod check is always reporting an error.

  checkDetectSecretsExists()
}

main()
