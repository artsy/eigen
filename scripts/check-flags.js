#!/usr/bin/env node

// @ts-check
"use strict"

const fs = require('fs');
// TODO: This is pretty fragile,
// depends on prefix, file location and name of readyForRelease key
// maybe we could do some fancy typescript parsing
// but for now should at least add some tests to the features file
// to make sure it doesn't break the script
// gets slightly more complicated when we have to get old versions of the file
const checkFlags = () => {
  try {
    const fileContent = fs.readFileSync('./src/lib/store/config/features.ts', 'utf8');
    const flagRE = /(?<flag>AR\w+):\s*{\s*|.*readyForRelease:\s(?<readyForRelease>true|false)/g
    const results = fileContent.matchAll(flagRE);
    var lastFlag
    var flags = {}
    for (const result of results) {
      if (result.groups['flag']) {
        const currentFlag = result.groups['flag']
        flags[currentFlag] = {}
        lastFlag = currentFlag
      }
      if (result.groups['readyForRelease']) {
        const readyForRelease = result.groups['readyForRelease']
        flags[lastFlag]["readyForRelease"] = (readyForRelease === 'true')
      }
    }
    var releasedFlags = []
    var hiddenFlags = []
    for (const key in flags) {
      const flag = flags[key]
      if (flag["readyForRelease"]) {
        releasedFlags.push(key)
      } else {
        hiddenFlags.push(key)
      }
    }
    return { hiddenFlags, releasedFlags }
  } catch (err) {
    return err
  }
}

// output to stdout so we can retrieve return value in fastlane
console.log(checkFlags())