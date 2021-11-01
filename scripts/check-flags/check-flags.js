#!/usr/bin/env node

// @ts-check
"use strict"

const fs = require('fs');
const checkFlags = () => {
  try {
    const fileContent = fs.readFileSync('./src/lib/store/config/features.ts', 'utf8');
    const releasedFlags = parseReleasedFlags(fileContent)
    const hiddenFlags = parseHiddenFlags(fileContent)
    return { hiddenFlags, releasedFlags }
  } catch (err) {
    return err
  }
}

const matchReadyForReleaseFlags = (content) => {
  const readyForReleaseFlagsRE = /(?<flag>AR\w+):\s*{\s*|.*readyForRelease:\s+(?<readyForRelease>true|false)/g
  const results = content.matchAll(readyForReleaseFlagsRE);
  return results
}

const matchAllFlags = (content) => {
  const allFlagsRE = /(?<flag>AR\w+):/g
  const results = content.matchAll(allFlagsRE);
  return results
}

module.exports.parseReleasedFlags = (content) => {
  const readyForReleaseFlagResults = matchReadyForReleaseFlags(content)
  var lastFlag
  var releasedFlags = []
  for (const result of readyForReleaseFlagResults) {
    if (result.groups['flag']) {
      const currentFlag = result.groups['flag']
      lastFlag = currentFlag
    }
    if (result.groups['readyForRelease']) {
      const readyForRelease = result.groups['readyForRelease']
      if (readyForRelease === 'true') {
        releasedFlags.push(lastFlag)
      }
    }
  }
  return releasedFlags
}

module.exports.parseHiddenFlags = (content, releasedFlags) => {
  const allFlagResults = matchAllFlags(content)
  var allFlags = []
  for (const result of allFlagResults) {
    if (result.groups['flag']) {
      const currentFlag = result.groups['flag']
      allFlags.push(currentFlag)
    }
  }
  return allFlags.filter(flag => !releasedFlags.includes(flag));
}


// write output to a file so we can retrieve in fastlane
const flags = checkFlags()
fs.writeFileSync('./fastlane/flags.json', JSON.stringify(flags))
