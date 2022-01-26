#!/usr/bin/env node

/**
 * This script runs a command to detect possible leaks of secrets.
 * The command has to be run in a very specific way, so we
 * construct it in this js file, and at the end we run it.
 */

const { pipe, reject, map } = require("lodash/fp")
const { spawnSync } = require("child_process")
const chalk = require("chalk")

const gray = (text) => chalk.bold.gray(text)

const exec = (command, cwd) => {
  console.log(gray(`$ ${command}`))

  const task = spawnSync(command, { shell: true, cwd })
  if (task.status != 0) {
    throw new Error(task.stderr.toString())
  }
  return task.stdout.toString()
}

const getFileArray = async (onlyStaged) => {
  const command = onlyStaged ? "git diff --staged --name-only" : "git ls-files"
  const files = (await exec(command)).split("\n")

  // clean up
  const filesToScan = pipe(
    reject((f) => f === ""), // empty strings are not files
    reject((f) => f.endsWith(".lock")), // ignore lock files, they are large and full of hashes
    reject((f) => f.endsWith(".png")), // ignore image files
    reject((f) => f.endsWith(".webp")), // ignore image files
    reject((f) => f.endsWith(".jpg")), // ignore image files
    reject((f) => f.endsWith(".jar")), // ignore jar files
    reject((f) => f.includes("__generated__")) // ignore relay generated files
  )(files)

  // escape these: '()
  const filesEscaped = map((f) => {
    const escaped = f
      .replace(/'/g, "\\'") // need to escape single quote for filenames like `Woman from L'Esperence.sticker`
      .replace(/\(/g, "\\(") // need to escape parens for filenames like `God from Creation of Adam (2).sticker`
      .replace(/\)/g, "\\)")
    return `"${escaped}"`
  })(filesToScan).join(" ")

  const command = `yarn detect-secrets-launcher --baseline .secrets.baseline ${filesArg}`
  try {
    const out = await exec(command)
    console.log({ out })
  } catch (e) {
    // if exit code is 3, it's a success with changes
    // https://github.com/Yelp/detect-secrets/pull/214
    if (e.message.includes("exit code 3")) {
      // keep going
    }
  }

  await exec("git add .secrets.baseline")
}

main()
