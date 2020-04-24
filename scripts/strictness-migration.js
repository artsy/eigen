// @ts-check

const glob = require("glob").sync
const fs = require("fs")
const _ = require("lodash")
const path = require("path")

const HERO_HELPER_FILENAME = ".i-am-helping-out-with-the-strictness-migration"

/**
 * @param {string | number | Buffer | import("url").URL} filePath
 */
function countIssuesInFile(filePath) {
  return (
    fs
      .readFileSync(filePath)
      .toString()
      .split("STRICTNESS_MIGRATION").length - 1
  )
}

switch (process.argv[2]) {
  case "count":
    if (process.argv.length === 3) {
      console.log(
        glob("src/**/*.ts{x,}")
          .map(countIssuesInFile)
          .reduce((a, b) => a + b, 0)
          .toString()
      )
    } else {
      console.log(
        _.flatten(process.argv.slice(3).map(f => glob(f, { nodir: true })))
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
    const files = _.flatten(process.argv.slice(3).map(f => glob(f, { nodir: true }))).map(file =>
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
}
