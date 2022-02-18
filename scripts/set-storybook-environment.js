#!/usr/bin/env node

// Change `metaflags.json` depending on STORYBOOK env variable
// to read the file content later in `index.ios.js` and `index.android.js`
// and either start the app or Storybook.

const fs = require("fs")

const startStorybook = process.env.STORYBOOK === "1"

const metaflags = require("../metaflags.json")

if (startStorybook) console.log("Starting storybook...")

metaflags.startStorybook = !!startStorybook

fs.writeFileSync("./metaflags.json", JSON.stringify(metaflags, undefined, 2) + "\n")
