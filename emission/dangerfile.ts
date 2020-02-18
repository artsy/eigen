import { danger, fail, markdown, warn } from "danger"

// TypeScript thinks we're in React Native,
// so the node API gives us errors:
import * as fs from "fs"
import * as path from "path"

// TODO: after moving emission package.json into eigen repo root, we can remove this
const qualify = (file: string) => path.join("../", file)

// Setup
const pr = danger.github.pr
const bodyAndTitle = (pr.body + pr.title).toLowerCase()

// Custom modifiers for people submitting PRs to be able to say "skip this"
const acceptedNoTests = bodyAndTitle.includes("#skip_new_tests")

const typescriptOnly = (file: string) => file.includes(".ts")
const filesOnly = (file: string) => fs.existsSync(file) && fs.lstatSync(file).isFile()

// Modified or Created can be treated the same a lot of the time
const createdFiles = danger.git.created_files.map(qualify).filter(filesOnly)

const appOnlyFilter = (filename: string) =>
  filename.includes("src/lib/") &&
  !filename.includes("__tests__") &&
  !filename.includes("__mocks__") &&
  typescriptOnly(filename)

const createdAppOnlyFiles = createdFiles.filter(appOnlyFilter)

// If it's not a branch PR
if (pr.base.repo.full_name !== pr.head.repo.full_name) {
  warn("This PR comes from a fork, and won't get JS generated for QA testing this PR inside the Emission Example app.")
}

// Check that every file created has a corresponding test file
const correspondingTestsForAppFiles = createdAppOnlyFiles.map(f => {
  const newPath = path.dirname(f)
  const name = path.basename(f).replace(".ts", "-tests.ts")
  return `${newPath}/__tests__/${name}`
})

// New app files should get new test files
// Allow warning instead of failing if you say "Skip New Tests" inside the body, make it explicit.
const testFilesThatDontExist = correspondingTestsForAppFiles
  .filter(f => !f.includes("Index-tests.tsx")) // skip indexes
  .filter(f => !f.includes("types-tests.ts")) // skip type definitions
  .filter(f => !f.includes("__stories__")) // skip stories
  .filter(f => !f.includes("AppRegistry")) // skip registry, kinda untestable
  .filter(f => !f.includes("Routes")) // skip routes, kinda untestable
  .filter(f => !f.includes("NativeModules")) // skip modules that are native, they are untestable
  .filter(f => !f.includes("lib/relay/")) // skip modules that are native, they are untestable
  .filter(f => !f.includes("Storybooks/")) // skip modules that are native, they are untestable
  .filter(f => !f.includes("fixtures")) // skip modules that are native, they are untestable
  .filter(f => !fs.existsSync(f))

if (testFilesThatDontExist.length > 0) {
  const callout = acceptedNoTests ? warn : fail
  const output = `Missing Test Files:

${testFilesThatDontExist.map(f => `- \`${f}\``).join("\n")}

If these files are supposed to not exist, please update your PR body to include "#skip_new_tests".`
  callout(output)
}

if (fs.existsSync("tsc_raw.log")) {
  const log = fs.readFileSync("tsc_raw.log")
  if (log.length) {
    fail("TypeScript hasn't passed, see below for full logs")
    markdown(`### TypeScript Fails\n\n\`\`\`${log}\`\`\``)
  }
}

// Show TSLint errors inline
// Yes, this is a bit lossy, we run the linter twice now, but its still a short amount of time
// Perhaps we could indicate that tslint failed somehow the first time?
if (fs.existsSync("tslint-errors.json")) {
  const tslintErrors = JSON.parse(fs.readFileSync("tslint-errors.json", "utf8")) as any[]
  if (tslintErrors.length) {
    const errors = tslintErrors.map(error => {
      const format = error.ruleSeverity === "ERROR" ? ":no_entry_sign:" : ":warning:"
      const linkToFile = danger.github.utils.fileLinks([error.name])
      return `* ${format} ${linkToFile} - ${error.ruleName} -${error.failure}`
    })
    const tslintMarkdown = `
  ## TSLint Issues:

  ${errors.join("\n")}
  `
    markdown(tslintMarkdown)
  }
}

// Show Jest fails in the PR
import jest from "danger-plugin-jest"
if (fs.existsSync("test-results.json")) {
  jest({ testResultsJsonPath: "test-results.json" })
}

const AppDelegate = fs.readFileSync("Example/Emission/AppDelegate.m", "utf8")
if (
  !AppDelegate.includes("static NSString *UserID = nil;") ||
  !AppDelegate.includes("static NSString *UserAccessToken = nil;")
) {
  fail(
    "Sensitive user credentials have been left in this PR, please remove those and sqaush the commits so no trace " +
      "of them is left behind."
  )
}
