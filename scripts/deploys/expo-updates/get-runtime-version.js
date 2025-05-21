// scripts/get-runtime-version.js
const fs = require("fs")
const path = require("path")

const appJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../../app.json")))
const version = appJson.expo.runtimeVersion

// Output the runtime version so we can access it in build.gradle
console.log(version)
