#!/usr/bin/env node

// @ts-check
"use strict"

const fs = require("fs")
module.exports.checkFlags = () => {
  try {
    const fileContent = fs.readFileSync("./src/app/store/config/features.ts", "utf8")
    const allFlags = this.parseAllFlags(fileContent) ?? [[], []]
    const hiddenFlags = allFlags[0]
    const releasedFlags = allFlags[1]
    return { hiddenFlags, releasedFlags }
  } catch (err) {
    return err
  }
}

/**
 * @param {string} content
 */
function matchFlags(content) {
  const flagsRE = /(?<flag>AR\w+):\s*{\s*|.*readyForRelease:\s+(?<readyForRelease>true|false)/g
  const results = matchAll(flagsRE, content)
  return results
}

/**
 * @param {RegExp} regex
 * @param {string} content
 */
function matchAll(regex, content) {
  var result
  var results = []
  while ((result = regex.exec(content))) {
    results.push(result)
  }
  return results
}

/**
 * @param {string} content
 */
module.exports.parseAllFlags = (content) => {
  const allFlagResults = matchFlags(content)
  var lastFlag
  var releasedFlags = []
  var hiddenFlags = []
  for (const result of allFlagResults) {
    if (!result.groups) {
      break
    }
    if (result.groups["flag"]) {
      const currentFlag = result.groups["flag"]
      lastFlag = currentFlag
    }
    if (result.groups["readyForRelease"]) {
      const readyForRelease = result.groups["readyForRelease"]
      if (readyForRelease === "true" && lastFlag) {
        releasedFlags.push(lastFlag)
      } else if (readyForRelease === "false" && lastFlag) {
        hiddenFlags.push(lastFlag)
      }
    }
  }
  return [hiddenFlags, releasedFlags]
}

// @ts-ignore
if (require.main === module) {
  const flags = this.checkFlags()
  // write output to a file so we can retrieve in fastlane
  fs.writeFileSync("./fastlane/flags.json", JSON.stringify(flags))
}
