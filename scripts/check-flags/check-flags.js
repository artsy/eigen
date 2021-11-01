#!/usr/bin/env node

// @ts-check
"use strict"

const fs = require('fs');
function checkFlags() {
  try {
    const fileContent = fs.readFileSync('./src/lib/store/config/features.ts', 'utf8');
    const releasedFlags = parseReleasedFlags(fileContent) ?? []
    const hiddenFlags = parseHiddenFlags(fileContent, releasedFlags)
    return { hiddenFlags, releasedFlags }
  } catch (err) {
    return err
  }
}

/**
 * @param {string} content
 */
function matchReadyForReleaseFlags(content) {
  const readyForReleaseFlagsRE = /(?<flag>AR\w+):\s*{\s*|.*readyForRelease:\s+(?<readyForRelease>true|false)/g
  const results = matchAll(readyForReleaseFlagsRE, content);
  return results
}

/**
 * @param {RegExp} regex
 * @param {string} content
 */
function matchAll(regex, content) {
  var result
  var results = []
  while (result = regex.exec(content)) {
    results.push(result)
  }
  return results
}

/**
 * @param {string} content
 */
function matchAllFlags(content) {
  const allFlagsRE = /(?<flag>AR\w+):/g
  const results = matchAll(allFlagsRE, content);
  return results
}

/**
 * @param {string} content
 */
export function parseReleasedFlags(content) {
  const readyForReleaseFlagResults = matchReadyForReleaseFlags(content)
  var lastFlag
  var releasedFlags = []
  for (const result of readyForReleaseFlagResults) {
    if (!result.groups) {
      break
    }
    if (result.groups['flag']) {
      const currentFlag = result.groups['flag']
      lastFlag = currentFlag
    }
    if (result.groups['readyForRelease']) {
      const readyForRelease = result.groups['readyForRelease']
      if (readyForRelease === 'true' && lastFlag) {
        releasedFlags.push(lastFlag)
      }
    }
  }
  return releasedFlags
}

/**
 * @param {string} content
 * @param {string[]} releasedFlags
 */
export function parseHiddenFlags(content, releasedFlags) {
  const allFlagResults = matchAllFlags(content)
  var allFlags = []
  for (const result of allFlagResults) {
    if (!result.groups) {
      break
    }
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
