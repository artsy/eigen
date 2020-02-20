// @ts-check

// Today we maintain our own specs repo for React Native's podspecs
// https://github.com/artsy/specs
//
// This deploys the individual podspecs which are required on RN updates
// inside emission.
//
// If you're here to make changes, check the Podfile to see if there are
// extra Podspecs being referenced that aren't at the bottom.
//

const fs = require("fs")
const path = require("path")
const spawnSync = require("child_process").spawnSync
const chalk = require("chalk")

function sh(command, canFail = false) {
  console.log("$ " + command)
  const task = spawnSync(command, { shell: true })
  if (!canFail && task.status != 0) {
    console.log(String(task.stdout))
    console.error(chalk.red(String(task.stderr)))
    throw new Error("[!] " + command)
  }
  return String(task.stdout)
}

function publishPodspec(podspec) {
  const podspecFilename = path.basename(podspec)
  const podspecDir = path.dirname(path.resolve(podspec))

  const name = path.basename(podspec, ".podspec")
  const version = JSON.parse(sh("pod ipc spec " + podspec)).version

  const specRepo = path.join(process.env.HOME, ".cocoapods/repos/artsy")
  const relativeSpecPath = path.join(name, version, name + ".podspec.json")
  const specPath = path.join(specRepo, relativeSpecPath)

  if (!fs.existsSync(specPath)) {
    console.log("=> Pushing " + name + " podspec to spec-repo.")
    sh("mkdir -p " + path.dirname(specPath))
    sh("cd " + podspecDir + ' && INCLUDE_METADATA="true" pod ipc spec ' + podspecFilename + " > " + specPath)
    sh(
      "cd " +
        specRepo +
        " && git pull " +
        " && git add " +
        relativeSpecPath +
        ' && git commit -m "' +
        name +
        " " +
        version +
        '" && git push'
    )
  }
}

console.log(chalk.green("=> Validating your tools."))
sh("bundle --version")
sh("npm --version")

console.log(chalk.green("=> Shipping Podspecs."))
publishPodspec("./node_modules/react-native/React.podspec")

// These may change in the future, see in Emission's podfile for the dependencies
publishPodspec("./node_modules/react-native/third-party-podspecs/DoubleConversion.podspec")
publishPodspec("./node_modules/react-native/third-party-podspecs/glog.podspec")
publishPodspec("./node_modules/react-native/third-party-podspecs/Folly.podspec")
publishPodspec("./node_modules/react-native/ReactCommon/yoga/yoga.podspec")
