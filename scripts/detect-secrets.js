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

const exec = (command, { dontExit } = { dontExit: false }) => {
  console.log(gray(`$ ${command}`))

  const task = spawnSync(command, { shell: true })
  console.log(task.stdout.toString())
  console.log(task.stderr.toString())

  if (task.status !== 0) {
    if (!dontExit) {
      process.exit(task.status)
    }
  }

  return { exitCode: task.status, stdout: task.stdout.toString(), stderr: task.stderr.toString() }
}

const getFileArray = async (onlyStaged) => {
  const command = onlyStaged ? "git diff --staged --name-only" : "git ls-files"
  const files = (await exec(command)).stdout.split("\n")

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
  })(filesToScan)

  return filesEscaped
}

const generateBaseline = async () => {
  const files = await getFileArray(false)
  const filesArg = files.join(" ")

  const command = `detect-secrets scan ${filesArg} > .secrets.baseline`
  await exec(command)
}

const check = async (onlyStaged) => {
  const files = await getFileArray(onlyStaged)
  const filesArg = files.join(" ")

  const command = `detect-secrets-hook --baseline .secrets.baseline ${filesArg}`
  await exec(command)
}

const scan = async (onlyStaged) => {
  const files = await getFileArray(onlyStaged)
  const filesArg = files.join(" ")

  const command = `detect-secrets scan --baseline .secrets.baseline ${filesArg}`
  try {
    await exec(command)
  } catch (e) {
    // if exit code is 3, it's a success with changes.
    // we just swallow the error and let the script continue.
    // https://github.com/Yelp/detect-secrets/pull/214
    if (e.message.includes("exit code 3")) {
      // do nothing with the error. keep going.
    }
  }
}

const main = async () => {
  switch (process.argv[2]) {
    case "generate":
      await generateBaseline()
      break

    case "check":
      await check(process.argv[3] === "staged")
      break

    case "scan":
      await scan(process.argv[3] === "staged")
      break

    default:
      await check(false)
      break
  }
}

main()
