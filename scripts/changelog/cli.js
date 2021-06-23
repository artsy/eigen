#!/usr/bin/env node

// @ts-check
"use strict"

/**
 * This file is used in CI to parse the list of merged pull requests
 * since the last public release per platform and get the changelogs for each one
 */
const { ArgumentParser } = require("argparse")
const updatePlatfromChangeLog = require("./generatePlatformChangelog").updatePlatfromChangeLog

const parser = new ArgumentParser({})

parser.add_argument("-p", "--platform", {
  help: `select destination platform ("android" or "ios")`,
})

const parsedArgs = parser.parse_args()

if (parsedArgs.platform !== "android" && parsedArgs.platform !== "ios") {
  console.error(`plaform needs to be either "android" or "ios"`)
  process.exit(1)
}

updatePlatfromChangeLog(parsedArgs.platform)
