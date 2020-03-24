#!/usr/bin/env node

// @ts-check

const fs = require("fs")
const path = require("path")
const crypto = require("crypto")

/**
 * @param {string} file
 */
function hash(file) {
  const md5 = crypto.createHash("md5")
  md5.update(fs.readFileSync(file))
  return md5.digest("hex")
}

function run() {
  const [_, __, outFileName, ...stringPatterns] = process.argv

  const regexPatterns = stringPatterns.map(s => new RegExp(s))

  const matchingFiles = []

  /**
   *
   * @param {string} file
   */
  function step(file) {
    const stat = fs.statSync(file)
    if (stat.isDirectory()) {
      for (const child of fs.readdirSync(file)) {
        step(path.join(file, child))
      }
    } else {
      for (const pattern of regexPatterns) {
        if (file.match(pattern)) {
          matchingFiles.push(file)
          break
        }
      }
    }
  }

  step(".")

  matchingFiles.sort()

  // dedupe
  for (let i = matchingFiles.length - 1; i > 0; i--) {
    if (matchingFiles[i] === matchingFiles[i - 1]) {
      matchingFiles.splice(i, 1)
    }
  }

  const outStream = fs.createWriteStream(outFileName, { encoding: "utf-8" })

  for (const file of matchingFiles) {
    outStream.write(`${file}\t${hash(file)}\n`)
  }

  outStream.close()
}

run()
