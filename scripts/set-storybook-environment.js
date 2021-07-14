#!/usr/bin/env node

const fs = require("fs")

const startStorybook = process.env.STORYBOOK === "1"

let fileContent

try {
  fileContent = require("../storybook.json")
} catch (e) {
  fileContent = {}
}

fileContent.startStorybook = !!startStorybook

fs.writeFileSync("./storybook.json", JSON.stringify(fileContent, undefined, 2))
