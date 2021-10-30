#!/usr/bin/env node

// @ts-check
"use strict"

const fs = require('fs');
const checkFlags = () => {
  try {
    const fileContent = fs.readFileSync('./src/lib/store/config/features.ts', 'utf8');
    const releasedFlagsRE = /(?<flag>AR\w+):\s*{\s*|.*readyForRelease:\s+(?<readyForRelease>true|false)/g
    const results = fileContent.matchAll(releasedFlagsRE);
    var lastFlag
    var releasedFlags = []
    for (const result of results) {
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

    const allFlagsRE = /(?<flag>AR\w+):/g
    const allFlagResults = fileContent.matchAll(allFlagsRE);

    var allFlags = []
    for (const result of allFlagResults) {
      if (result.groups['flag']) {
        const currentFlag = result.groups['flag']
        allFlags.push(currentFlag)
      }
    }

    const hiddenFlags = allFlags.filter(flag => !releasedFlags.includes(flag));

    return { hiddenFlags, releasedFlags }
  } catch (err) {
    return err
  }
}

// write output to a file so we can retrieve in fastlane
const flags = checkFlags()
fs.writeFileSync('./fastlane/flags.json', JSON.stringify(flags))
