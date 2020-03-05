// @ts-check

const glob = require("glob")
const { flatten } = require("lodash")
const crypto = require("crypto")
const fs = require("fs")

const globs = [
  "Podfile*",
  "Makefile",
  "Gemfile*",
  "emission/**/*",
  "Artsy.xcodeproj/**/*",
  "Artsy/**/*",
  "Artsy_Tests/**/*",
]

const files = flatten(globs.map(pattern => glob.sync(pattern, { nodir: true })))

const checksum = crypto.createHash("md5")

for (const file of files) {
  checksum.update(fs.readFileSync(file))
}

fs.writeFileSync("./native-code-checksum.hash", checksum.digest("hex"))
