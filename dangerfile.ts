
import { danger, fail, warn } from "danger"
import { compact, includes, remove, uniq } from "lodash"

import * as fs from "fs"
import * as os from "os"
import * as path from "path"

import * as recurseSync from "recursive-readdir-sync"
const allFiles = recurseSync("./src")

// Setup
const pr = danger.github.pr
const modified = danger.git.modified_files
const newFiles = danger.git.created_files
const bodyAndTitle = (pr.body + pr.title).toLowerCase()

// Custom modifiers for people submitting PRs to be able to say "skip this"
const trivialPR = bodyAndTitle.includes("trivial")
const acceptedNoTests = bodyAndTitle.includes("skip new tests")

const typescriptOnly = (file: string) => includes(file, ".ts")
const filesOnly = (file: string) => fs.existsSync(file) && fs.lstatSync(file).isFile()

// Custom subsets of known files
const modifiedAppFiles = modified.filter(p => includes(p, "lib/")).filter(p => filesOnly(p) && typescriptOnly(p))

// Modified or Created can be treated the same a lot of the time
const touchedFiles = modified.concat(danger.git.created_files).filter(p => filesOnly(p))

const touchedAppOnlyFiles = touchedFiles.filter(p =>
  includes(p, "src/lib/") && !includes(p, "__tests__") && typescriptOnly(p))

const touchedComponents = touchedFiles.filter(p =>
  includes(p, "src/lib/components") && !includes(p, "__tests__"))

const touchedTestFiles = touchedFiles.filter(p => includes(p, "__tests__"))
const touchedStoryFiles = touchedFiles.filter(p => includes(p, "__stories__"))

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
const testFilesThatDontExist = correspondingTestsForAppFiles
                                 .filter(f => !f.includes("index-tests.tsx")) // skip indexes
                                 .filter(f => !f.includes("__stories__")) // skip stories
                                 .filter(f => !f.includes("app_registry")) // skip registry, kinda untestable
                                 .filter(f => !f.includes("routes")) // skip routes, kinda untestable
                                 .filter(f => !fs.existsSync(f))

if (testFilesThatDontExist.length > 0) {
  const callout = acceptedNoTests ? warn : fail
  const output = `Missing Test Files:

${testFilesThatDontExist.map(f => `- \`${f}\``).join("\n")}

If these files are supposed to not exist, please update your PR body to include "Skip New Tests".`
  callout(output)
}

// A component should have a corresponding story reference, so that we're consistent
// with how the web create their components

const reactComponentForPath = (filePath) => {
  const content = fs.readFileSync(filePath).toString()
  const match = content.match(/class (.*) extends React.Component/)
  if (!match || match.length === 0) { return null }
  return match[1]
}

// Start with a full list of all Components, then look
// through all story files removing them from the list if found.
// If any are left, leave a warning.
let componentsForFiles = uniq(compact(touchedComponents.map(reactComponentForPath)))
const storyFiles = allFiles.filter(f => f.includes("__stories__/") && f.includes(".story."))

storyFiles.forEach(story => {
  const content = fs.readFileSync(story, "utf8")
  componentsForFiles.forEach(component => {
    if (content.includes(component)) {
      componentsForFiles = componentsForFiles.filter(f => f !== component)
    }
  })
})

if (componentsForFiles.length) {
  const components = componentsForFiles.map(c => `- \`${c}\``).join("\n")
  warn(`Could not find stories using these components:

${components}

`)
}
