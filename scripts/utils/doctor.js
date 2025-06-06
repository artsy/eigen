#!/usr/bin/env node

/**
 * This script runs some trivial checks to identify possible
 * issues related to the project configuration and suggest ways to solve them.
 * So far, this script does 2 main things.
 * - Check if the environment variables match the ones in S3
 * - Verify if there is a version mismath in node modules
 */

const { spawnSync } = require("child_process")
const fs = require("fs")
const chalk = require("chalk")
const { check } = require("yargs")

const desiredVersions = {
  xcode: "16.1",
  androidStudio: "2022.3",
  ruby: "3.1.6",
  bundler: "2.4.3",
  eas: "16.9.0",
}

const exec = (command, cwd) => {
  const task = spawnSync(command, { shell: true, cwd })
  if (task.status != 0) {
    throw new Error(task.stderr.toString())
  }
  return task.stdout.toString()
}

const execReturnErrors = (command, cwd) => {
  const task = spawnSync(command, { shell: true, cwd, encoding: "utf8" })
  return { stdout: task.stdout, stderr: task.stderr, status: task.status }
}

const NO = (message, suggestion) => {
  console.log(`🔴 ${message}`)
  if (suggestion) console.log(`└──> ${suggestion}`)
}
const YES = (message) => console.log(`🟢 ${message}`)
const WARN = (message) => console.log(`🟡 ${message}`)
const g = (text) => chalk.bold.green(text)
const r = (text) => chalk.bold.red(text)

const checkDotEnvVariablesAreUpToDate = () => {
  exec("touch .env.temp")
  exec("aws s3 cp s3://artsy-citadel/eigen/.env.shared .env.temp")

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

const checkEnvJSONVariablesAreUpToDate = () => {
  exec("touch keys.shared.json.temp")
  exec("aws s3 cp s3://artsy-citadel/eigen/keys.shared.json keys.shared.json.temp")

  const updatedEnv = fs.readFileSync("./keys.shared.json.temp", "utf8").toString()
  let localEnv = ""
  try {
    localEnv = fs.readFileSync("./keys.shared.json", "utf8").toString()
  } catch (e) {
    // in that case, we don't even have a `keys.shared.json`.
    localEnv = "nope"
  }

  if (updatedEnv !== localEnv) {
    NO(
      `Your ${r`keys.shared.json file`} does not match the one in AWS.`,
      `Run ${g`yarn setup:artsy`}.`
    )
  } else {
    YES(`Your ${g`keys.shared.json file`} seems to be valid.`)
  }
  exec("rm keys.shared.json.temp")
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
    const output = exec("ruby --version")
    const versionMatch = output.match(/ruby (\d+\.\d+\.\d+)/)
    if (!versionMatch) {
      throw new Error("Unable to determine Ruby version")
    }
    const installedVersion = versionMatch[1]
    if (installedVersion === desiredVersions.ruby) {
      YES(`Ruby is installed and version is correct: ${installedVersion}`)
    } else {
      WARN(`Ruby version is ${installedVersion}, but ${desiredVersions.ruby} is expected`)
    }
  } catch (e) {
    NO(`Error checking Ruby: ${e.message}`, `Install ${g`ruby`} ${desiredVersions.ruby} first.`)
  }
}

const checkBundlerExists = () => {
  try {
    const output = exec("bundle --version")
    const versionMatch = output.match(/Bundler version (\d+\.\d+\.\d+)/)
    if (!versionMatch) {
      throw new Error("Unable to determine Bundler version")
    }
    const installedVersion = versionMatch[1]
    if (installedVersion === desiredVersions.bundler) {
      YES(`Bundler is installed and version is correct: ${installedVersion}`)
    } else {
      WARN(`Bundler version is ${installedVersion}, but ${desiredVersions.bundler} is expected`)
    }
  } catch (e) {
    NO(
      `Error checking Bundler: ${e.message}`,
      `Install ${g`bundler`} ${desiredVersions.bundler} first.`
    )
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
  try {
    const output = exec("yarn check --integrity")

    // If the output contains the "success" message, everything is in sync
    if (output.includes("success Folder in sync.")) {
      YES(`Your ${g`node dependencies`} match the ones specified in package.json.`)
    } else {
      NO(
        `Your ${r`node dependencies`} are out of sync.`,
        `Run ${g`yarn install:all`} or ${g`yarn install`} first.`
      )
    }
  } catch (error) {
    console.error(error)
    // If there's an error thrown (for example, if `yarn check --integrity` returns a non-zero exit code)
    NO(
      `Your ${r`node dependencies`} are out of sync.`,
      `Run ${g`yarn install:all`} or ${g`yarn install`} first.`
    )
  }
}

const checkPodDependenciesAreUpToDate = async () => {
  try {
    const { stdout, stderr, status } = execReturnErrors("bundle exec pod check", "./ios")

    // https://github.com/square/cocoapods-check/issues/18
    // This is a bug for some react native deps in cocoapods-check
    // might be a nice OSS contribution opportunity!
    const knownException = `~RNFastImage, ~RNImageCropPicker, ~RNPermissions, ~RNShare, ~React-RCTFabric, ~ReactCodegen, ~react-native-blob-util, ~react-native-view-shot\n[!] \`pod install\` will install 8 Pods.`

    // pod check will return status 1 even for only warnings
    if (status !== 0) {
      if (stderr.includes("warning:")) {
        // If there are only warnings, we might still want to proceed with checking stdout
        WARN("Warnings encountered during pod check: " + stderr)
      } else {
        NO(
          `Your ${r`pod dependencies`} are out of sync.`,
          `Run ${g`bundle exec npx pod-install`} in the iOS directory.`
        )
      }
    }

    if (stdout.includes(knownException) || !stdout.includes("[!]")) {
      YES(`Your ${g`pod dependencies`} are correctly installed.`)
    } else {
      NO(
        `Your ${r`pod dependencies`} are out of sync.`,
        `Run ${g`bundle exec npx pod-install`} in the iOS directory.`
      )
    }
  } catch (error) {
    console.error(error)
    NO(`Your ${r`pod dependencies`} encountered an error during verification.`)
  }
}

const checkDetectSecretsExists = () => {
  try {
    exec("detect-secrets-hook --version")
    YES(`Your ${g`detect-secrets`} is ready to go.`)
  } catch (e) {
    console.error(e)
    NO(
      `Your ${r`detect-secrets`} is missing or not linked.`,
      `Run ${g`yarn install:all`} to install, and then make sure it's in your $PATH.`
    )
  }
}

const checkXcodeVersion = () => {
  try {
    const output = exec("xcodebuild -version")

    const versionMatch = output.match(/Xcode (\d+\.\d+(\.\d+)?)/)
    if (!versionMatch) {
      throw new Error("Unable to determine Xcode version.")
    }

    const installedVersion = versionMatch[1]
    if (installedVersion === desiredVersions.xcode) {
      YES(`Xcode is installed and the version is correct (${installedVersion}).`)
    } else {
      WARN(
        `Xcode is installed but the version is incorrect. Installed: ${installedVersion}, Expected: ${desiredVersions.xcode}`
      )
    }
  } catch (error) {
    console.error(error)
    NO(`Xcode is not installed or there was an error determining the version.`)
  }
}

const checkAndroidStudioVersion = () => {
  try {
    const plistPath = "/Applications/Android\\ Studio.app/Contents/Info.plist"
    const plistBuddyCmd = `/usr/libexec/PlistBuddy -c "Print CFBundleShortVersionString" ${plistPath}`

    const installedVersion = exec(plistBuddyCmd).trim()

    if (installedVersion === desiredVersions.androidStudio) {
      YES(`Android Studio is installed and the version is correct (${installedVersion}).`)
    } else {
      WARN(
        `Android Studio is installed but the version is incorrect. Installed: ${installedVersion}, Expected: ${desiredVersions.androidStudio}`
      )
    }
  } catch (error) {
    console.error(error)
    NO(`Android Studio is not installed or there was an error determining the version.`)
  }
}

const checkEASCLIVersion = () => {
  try {
    const fullOutput = exec("eas --version").trim()
    const match = fullOutput.match(/^eas-cli\/(\d+\.\d+\.\d+)/)

    if (!match) {
      throw new Error(`Could not parse eas-cli version from output: "${fullOutput}"`)
    }

    const actualVersion = match[1]

    if (actualVersion === desiredVersions.eas) {
      YES(`eas-cli version: ${fullOutput}`)
    } else {
      WARN(
        `eas-cli version is ${fullOutput}, but ${desiredVersions.eas} is expected.`,
        `Run ${g(`npm install -g eas-cli@${desiredVersions.eas}`)} and ${g(`asdf reshim nodejs`)}.`
      )
    }
  } catch (e) {
    NO(
      `Could not determine eas-cli version.`,
      `Make sure it's installed globally via ${g(`npm install -g eas-cli@${desiredVersions.eas}`)}.`
    )
  }
}

const main = async () => {
  checkEnvJSONVariablesAreUpToDate()
  checkDotEnvVariablesAreUpToDate()

  checkNodeExists()
  checkYarnExists()
  checkRubyExists()
  checkBundlerExists()

  checkBundlerDependenciesAreUpToDate()
  await checkNodeDependenciesAreUpToDate()
  checkPodDependenciesAreUpToDate()

  checkDetectSecretsExists()
  checkXcodeVersion()
  checkAndroidStudioVersion()
  checkEASCLIVersion()
}

main()
