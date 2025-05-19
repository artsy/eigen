// scripts/get-runtime-version.js
const fs = require("fs")
const path = require("path")

const appJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../../app.json")))
const version = appJson.expo.runtimeVersion
console.log(version)
