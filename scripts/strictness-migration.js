// @ts-check

const glob = require("glob").sync
const fs = require("fs")
const _ = require("lodash")
const path = require("path")
const chalk = require("chalk").default
const { execSync } = require("child_process")

const HERO_HELPER_FILENAME = ".i-am-helping-out-with-the-strictness-migration"

/**
 * @param {string | number | Buffer | import("url").URL} filePath
 */
function countIssuesInFile(filePath) {
  return fs.readFileSync(filePath).toString().split("STRICTNESS_MIGRATION").length - 1
}

function countIssuesInWholeProject() {
  return glob("src/**/*.ts{x,}")
    .map(countIssuesInFile)
    .reduce((a, b) => a + b, 0)
}

switch (process.argv[2]) {
  case "count":
    if (process.argv.length === 3) {
      console.log(countIssuesInWholeProject().toString())
    } else {
      console.log(
        _.flatten(process.argv.slice(3).map((f) => glob(f, { nodir: true })))
          .map(countIssuesInFile)
          .reduce((a, b) => a + b, 0)
          .toString()
      )
    }
    break
  case "check-staged":
    // this is designed to be used with lint-staged
    if (!fs.existsSync(HERO_HELPER_FILENAME)) {
      console.log(`Run 'touch ${HERO_HELPER_FILENAME}' to join in the migration fun`)
      break
    }
    const files = _.flatten(process.argv.slice(3).map((f) => glob(f, { nodir: true }))).map((file) =>
      path.relative(process.cwd(), path.resolve(file))
    )
    let allClear = true
    for (const file of files) {
      const numIssues = countIssuesInFile(file)
      if (numIssues > 0) {
        if (allClear) {
          console.error("Found some strictness issues in staged files:\n")
          allClear = false
        }
        console.error(`    ${numIssues} strictness issues in file ${file}`)
      }
    }

    if (allClear) {
      console.log("All clear! ✅")
    } else {
      console.error(
        "\nThere were leftover strictness migration flags in your staged files. You can do one of the following:\n"
      )
      console.error(" ∙ Refactor to remove the flags 😇")
      console.error(" ∙ Commit with --no-verify to skip for now 🏃‍")
      console.error(` ∙ Delete ${HERO_HELPER_FILENAME} to skip forever 🙃`)
      process.exit(1)
    }

    break
  case "check-pr":
    try {
      execSync("git merge origin/main", { stdio: "inherit" })
    } catch (e) {
      console.log("Branch has conflicts with main, aborting strictness migration check")
      process.exit(0)
    }
    const current = countIssuesInWholeProject()
    execSync("git checkout origin/main", { stdio: "inherit" })
    const onMain = countIssuesInWholeProject()
    if (current > onMain) {
      console.error(
        chalk.yellow.bold("WARNING:"),
        `The number of comments with the substring ${chalk.cyan("STRICTNESS_MIGRATION")} has risen from ${chalk.green(
          onMain
        )} in ${chalk.bold("main")} to ${chalk.red(current)} in this PR.`
      )
      console.error(
        `These comments were added when we switched on TypeScript's strict mode, and their number should only ever go down.\n`
      )

      console.error(
        `It is safe to ignore this failure if you are in a hurry, but please consider refactoring to remove these tags.`
      )
      process.exit(1)
    } else if (current < onMain) {
      console.log(
        `Yay! Thanks for decreasing the number of strictness migration issues from ${chalk.bold(
          onMain
        )} to ${chalk.bold(current)} 🌟`
      )
    } else {
      console.log(`There's still ${chalk.bold(onMain)} strictness migration issues to fix.`)
    }
}
