#!/usr/bin/env node

// Create or change `storybook.json` depending on STORYBOOK env variable
// to read the file content later in `index.ios.js` and `index.android.js`
// and either start the app or Storybook.

const fs = require("fs")

const startStorybook = process.env.STORYBOOK === "1"

let fileContent

try {
  fileContent = require("../storybook.json")
} catch (e) {
  fileContent = {}
}

if (startStorybook) console.log("Starting storybook...")

fileContent.startStorybook = !!startStorybook

fs.writeFileSync("./storybook.json", JSON.stringify(fileContent, undefined, 2))
