
import { danger, fail, warn } from "danger"
import { compact, includes, remove } from "lodash"

// For now you can ignore these 3 errors, I'm not sure why
// they are being raised. They definitely exist in the node runtime.
const fs = require("fs") // tslint:disable-line
const os = require("os") // tslint:disable-line
const path = require("path") // tslint:disable-line

// Setup
const pr = danger.github.pr
const modified = danger.git.modified_files
const newFiles = danger.git.created_files
const bodyAndTitle = (pr.body + pr.title).toLowerCase()

// Custom modifiers for people submitting PRs to be able to say "skip this"
const trivialPR = bodyAndTitle.includes("trivial")
const acceptedNoTests = bodyAndTitle.includes("skip new tests")

// Custom subsets of known files
const modifiedAppFiles = modified.filter(p => includes(p, "lib/"))
const modifiedTestFiles = modified.filter(p => includes(p, "__tests__"))

// Modified or Created can be treated the same a lot of the time
const touchedFiles = modified.concat(danger.git.created_files)
const touchedAppOnlyFiles = touchedFiles.filter(p => includes(p, "src/lib/") && !includes(p, "__tests__"))
const touchedComponents = touchedFiles.filter(p => includes(p, "src/lib/components") && !includes(p, "__tests__"))

const touchedTestFiles = touchedFiles.filter(p => includes(p, "__tests__"))
const touchedStoryFiles = touchedFiles.filter(p => includes(p, "src/stories"))

// Rules

// When there are app-changes and it's not a PR marked as trivial, expect
// there to be CHANGELOG changes.
const changelogChanges = includes(modified, "CHANGELOG.md")
if (modifiedAppFiles.length > 0 && !trivialPR && !changelogChanges) {
  fail("No CHANGELOG added.")
}

// No PR is too small to warrant a paragraph or two of summary
if (pr.body.length === 0) {
  fail("Please add a description to your PR.")
}

// Warn if there are changes to package.json without changes to yarn.lock.
const packageChanged = includes(modified, "package.json")
const lockfileChanged = includes(modified, "yarn.lock")
if (packageChanged && !lockfileChanged) {
  const message = "Changes were made to package.json, but not to yarn.lock"
  const idea = "Perhaps you need to run `yarn install`?"
  warn(`${message} - <i>${idea}</i>`)
}

// Always ensure we assign someone, so that our Slackbot can do its work correctly
if (pr.assignee === null) {
  const method = pr.title.includes("WIP") ? warn : fail
  method("Please assign someone to merge this PR, and optionally include people who should review.")
}

// Check that every file touched has a corresponding test file
const correspondingTestsForAppFiles = touchedAppOnlyFiles.map(f => {
  const newPath = path.dirname(f)
  const name = path.basename(f).replace(".ts", "-tests.ts")
  return `${newPath}/__tests__/${name}`
})

// New app files should get new test files
// Allow warning instead of failing if you say "Skip New Tests" inside the body, make it explicit.
const testFilesThatDontExist = correspondingTestsForAppFiles.filter(f => fs.existsSync(f))
if (testFilesThatDontExist.length > 0) {
  const callout = acceptedNoTests ? warn : fail
  const output = `Missing Test Files:
    ${testFilesThatDontExist.map(f => `  - [] \`${f}\``).join("\n")}

    If these files are supposed to not exist, please update your PR body to include "Skip New Tests".
  `
  callout(output)
}

// A component should have a corresponding story reference, so that we're consistent
// with how the web create their components

const reactComponentForPath = (filePath) => {
  const content = fs.readFileSync(filePath).toString()
  const match = content.match(/export class (.*) extends React.Component/)
  if (!match || match.length === 0) { return null }
  return match[0]
}

// Start with a full list of all Components, then look
// through all story files removing them from the list if found.
// If any are left, leave a warning.
let componentsForFiles = compact(touchedComponents.map(reactComponentForPath))

// This may need updating once there are multiple folders for components
const storyFiles = fs.readdirSync("src/stories")

storyFiles.forEach(story => {
  const content = fs.readFileSync("src/stories/" + story).toString()
  componentsForFiles.forEach(component => {
    if (content.includes(component)) {
      componentsForFiles = componentsForFiles.filter(f => f !== component)
    }
  })
})

if (componentsForFiles.length) {
  const components = componentsForFiles.map(c => ` - [] \`${c}\``).join("\n")
  warn(`Could not find corresponding stories for these components: \n${components}`)
}
