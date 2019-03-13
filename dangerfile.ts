import { danger, fail, markdown, warn } from "danger"
import { compact, includes, uniq } from "lodash"

// TypeScript thinks we're in React Native,
// so the node API gives us errors:
import * as fs from "fs"
import * as path from "path"

import * as recurseSync from "recursive-readdir-sync"
const allFiles = recurseSync("./src")

// Setup
const pr = danger.github.pr
const modified = danger.git.modified_files
const bodyAndTitle = (pr.body + pr.title).toLowerCase()

// Custom modifiers for people submitting PRs to be able to say "skip this"
const trivialPR = bodyAndTitle.includes("#trivial")
const acceptedNoTests = bodyAndTitle.includes("#skip_new_tests")
const acceptedNoNativeChanges = bodyAndTitle.includes("#native_no_changes")

const typescriptOnly = (file: string) => includes(file, ".ts")
const filesOnly = (file: string) => fs.existsSync(file) && fs.lstatSync(file).isFile()

// Custom subsets of known files
const modifiedAppFiles = modified.filter(p => includes(p, "lib/")).filter(p => filesOnly(p) && typescriptOnly(p))

// Modified or Created can be treated the same a lot of the time
const touchedFiles = modified.concat(danger.git.created_files).filter(p => filesOnly(p))

const touchedAppOnlyFiles = touchedFiles.filter(
  p => includes(p, "src/lib/") && !includes(p, "__tests__") && typescriptOnly(p)
)

const touchedComponents = touchedFiles.filter(p => includes(p, "src/lib/components") && !includes(p, "__tests__"))

// Rules

// If it's not a branch PR
if (pr.base.repo.full_name !== pr.head.repo.full_name) {
  warn("This PR comes from a fork, and won't get JS generated for QA testing this PR inside the Emission Example app.")
}

// When there are app-changes and it's not a PR marked as trivial, expect
// there to be CHANGELOG changes.
const changelogChanges = includes(modified, "CHANGELOG.md")
if (modifiedAppFiles.length > 0 && !trivialPR && !changelogChanges) {
  fail("No CHANGELOG added.")
}

// Check that the changelog contains only H3's
if (changelogChanges && fs.readFileSync("CHANGELOG.md", "utf8").includes("\n## ")) {
  fail("Changelog must only contain H3's, but contains H2's.")
}

// Check that every file touched has a corresponding test file
const correspondingTestsForAppFiles = touchedAppOnlyFiles.map(f => {
  const newPath = path.dirname(f)
  const name = path.basename(f).replace(".ts", "-tests.ts")
  return `${newPath}/__tests__/${name}`
})

// // New app files should get new test files
// // Allow warning instead of failing if you say "Skip New Tests" inside the body, make it explicit.
// const testFilesThatDontExist = correspondingTestsForAppFiles
//   .filter(f => !f.includes("Index-tests.tsx")) // skip indexes
//   .filter(f => !f.includes("types-tests.ts")) // skip type definitions
//   .filter(f => !f.includes("__stories__")) // skip stories
//   .filter(f => !f.includes("AppRegistry")) // skip registry, kinda untestable
//   .filter(f => !f.includes("Routes")) // skip routes, kinda untestable
//   .filter(f => !f.includes("NativeModules")) // skip modules that are native, they are untestable
//   .filter(f => !f.includes("lib/relay/")) // skip modules that are native, they are untestable
//   .filter(f => !f.includes("Storybooks/")) // skip modules that are native, they are untestable
//   .filter(f => !f.includes("fixtures")) // skip modules that are native, they are untestable
//   .filter(f => !fs.existsSync(f))

// if (testFilesThatDontExist.length > 0) {
//   const callout = acceptedNoTests ? warn : fail
//   const output = `Missing Test Files:

// ${testFilesThatDontExist.map(f => `- \`${f}\``).join("\n")}

// If these files are supposed to not exist, please update your PR body to include "#skip_new_tests".`
//   callout(output)
// }

// A component should have a corresponding story reference, so that we're consistent
// with how the web create their components
const reactComponentForPath = filePath => {
  const content = fs.readFileSync(filePath).toString()
  const match = content.match(/class (.*) extends React.Component/)
  if (!match || match.length === 0) {
    return null
  }
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

// We'd like to improve visibility of whether someone has tested on a device,
// or run through the code at all. So, to look at improving this, we're going to try appending
// a checklist, and provide useful info on how to run the code yourself inside the PR.
const splitter = `<hr data-danger="yep"/>`
const userBody = pr.body.split(splitter)[0]
const localBranch = `${pr.user.login}-${pr.number}-checkout`
const bodyFooter = `
### Tested on Device?

- [ ] @${pr.user.login}
${pr.assignees.map(assignee => `- [ ] @${assignee.login}`).join("\n")}

<details>
  <summary>How to get set up with this PR?</summary>
  <p>&nbsp;</p>
   <p><b>To run on your computer:</b></p>
<pre><code>git fetch origin pull/${pr.number}/head:${localBranch}
git checkout ${localBranch}
yarn install
cd example; pod install; cd ..
open -a Simulator
yarn start</code></pre>
   </p>
   <p>Then run <code>xcrun simctl launch booted net.artsy.Emission</code> once a the simulator has finished booting</p>
   <p><b>To run inside Eigen (prod or beta) or Emission (beta):</b> Shake the phone to get the Admin menu.</p>
   <p>If you see <i>"Use Staging React Env" </i> - click that and restart, then follow the next step.</p>
   <p>Click on <i>"Choose an RN build" </i> - then pick the one that says: "X,Y,Z"</p>
   <p>Note: this is a TODO for PRs, currently  you can only do it on master commits.</p>
</details>
`
const newBody = userBody + splitter + "\n" + bodyFooter

// The individual state of a ticked/unticket item in a markdown list should not
// require Danger to submit a new body (and thus overwrite those changes.)
const neuterMarkdownTicks = /- \[*.\]/g
if (pr.body.replace(neuterMarkdownTicks, "-") !== newBody.replace(neuterMarkdownTicks, "-")) {
  // See https://github.com/artsy/emission/issues/589
  // danger.github.api.pullRequests.update({...danger.github.thisPR, body: newBody })
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

// Raise when native code changes are made, but the package.json does not
// have a bump for the native code version
//
const hasNativeCodeChanges = modified.find(p => p.includes("Pod/Classes"))
const hasPackageJSONChanges = modified.find(p => p === "package.json")
if (hasNativeCodeChanges && !hasPackageJSONChanges && !acceptedNoNativeChanges) {
  fail(
    `This PR includes changes to the Emission Pod's native code but does not have a \`package.json\`
     change for the update to the \`"native-code-version"\`. If this is fine, add #native_no_changes to your PR message.`
  )
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
