const prompt = require("prompt-sync")()
const ora = require("ora")
const { exec } = require("./helpers/exec")

// Read the android and iOS candidate tags
var androidTag = prompt("What's the android release tag? ")
var iOSTag = prompt("What's the iOS release tag? ")

/**
 * @param {string} tag
 */
function addSubmissionTag(tag) {
  const platform = tag.includes("android") ? "android" : "ios"
  const spinner = ora(`adding submission tag to ${platform} ...`).start()

  try {
    exec(`git checkout ${tag}`)
    exec(`git tag ${tag}-submission`)
    exec(`git push origin ${tag}-submission`)
    spinner.succeed()
  } catch (e) {
    spinner.fail()
    console.error(e)
  }
}

// Add the submission tag to the android release
addSubmissionTag(androidTag)
// Add the submission tag to the iOS release
addSubmissionTag(iOSTag)
