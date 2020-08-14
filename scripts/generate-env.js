#!/usr/bin/env node

// @ts-check

/*
This file is used on CI to extract env vars from the CI environment and place
them in a .env file for use by react-native-config. It uses the .env.example
as a source-of-truth for the env vars to extract.

Since it only is meant to be used on CI, it is a nop when ran locally.
*/

const fs = require("fs")
const path = require("path")

function run() {
  if (!process.env.CI) {
    console.log("Not running on CI, skipping env var extraction.")
    return
  }

  const envExample = fs.readFileSync(".env.example").toString()
  const envVarNames = envExample
    .split("\n")
    .map(line => line.match(/^([^=]+)=.+$/))
    .filter(match => match !== null)
    .map(match => match[1])
  const envContents = envVarNames.map(v => `${v}=${process.env[v] || ""}`).join("\n")
  fs.writeFileSync(".env", envContents)
}

run()
