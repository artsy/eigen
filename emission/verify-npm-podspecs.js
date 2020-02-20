const podspecs = require("./npm-podspecs.json")
const fs = require("fs")

console.log("Verifying that npm-vendored podspecs exist 👀")

let allClear = true
for (const [pod, { podspec, path }] of Object.entries(podspecs)) {
  if (podspec && !fs.existsSync(podspec)) {
    console.error(`Pod '${pod}' not found at path '${podspec}'`)
    allClear = false
  }
  if (path && !fs.existsSync(path)) {
    console.error(`Pod '${pod}' not found at path '${path}'`)
    allClear = false
  }
}

if (!allClear) {
  console.error("Please make sure that npm-podspecs.json is up-to-date and correct.")
  process.exit(1)
} else {
  console.log("Yep all good 🎉")
}
