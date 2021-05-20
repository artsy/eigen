import { danger, fail, markdown, warn } from "danger"
// TypeScript thinks we're in React Native,
// so the node API gives us errors:
import * as fs from "fs"
import { pickBy } from "lodash"
import * as yaml from "yaml"
import { ParseResult } from "./scripts/changelog/changelog-types"
import { changelogTemplateSections } from "./scripts/changelog/generateChangelogSectionTemplate"
import { parsePRDescription } from "./scripts/changelog/parsePRDescription"

/**
 * Helpers
 */
const typescriptOnly = (file: string) => file.includes(".ts")
const filesOnly = (file: string) => fs.existsSync(file) && fs.lstatSync(file).isFile()

// Modified or Created can be treated the same a lot of the time
const getCreatedFiles = (createdFiles: string[]) => createdFiles.filter(filesOnly)

const testOnlyFilter = (filename: string) => filename.includes("-tests") && typescriptOnly(filename)

/**
 * Danger Rules
 */
// We are trying to migrate away from Enzyme towards react-test-renderer
const preventUsingEnzyme = () => {
  const newEnzymeImports = getCreatedFiles(danger.git.created_files)
    .filter(testOnlyFilter)
    .filter((filename) => {
      const content = fs.readFileSync(filename).toString()
      return content.includes('from "enzyme"')
    })
  if (newEnzymeImports.length > 0) {
    warn(`We are trying to migrate away from Enzyme towards \`react-test-renderer\`, but found Enzyme imports in the following new unit test files:

${newEnzymeImports.map((filename) => `- \`${filename}\``).join("\n")}

See [\`placeholders-tests.tsx\`](https://github.com/artsy/eigen/blob/aebce6e50ece296b5dc63681f7ae0b6ed20b4bcc/src/lib/utils/__tests__/placeholders-tests.tsx) as an example, or [the docs](https://reactjs.org/docs/test-renderer.html).
  `)
  }
}

const preventUsingRenderRelayTree = () => {
  const newRenderRelayTreeImports = getCreatedFiles(danger.git.created_files)
    .filter(testOnlyFilter)
    .filter((filename) => {
      const content = fs.readFileSync(filename).toString()
      return content.includes('from "lib/tests/renderRelayTree"')
    })
  if (newRenderRelayTreeImports.length > 0) {
    warn(`We are trying to migrate away from \`renderRelayTree\` towards \`relay-test-utils\`, but found Enzyme imports in the following new unit test files:

  ${newRenderRelayTreeImports.map((filename) => `- \`${filename}\``).join("\n")}

  See [\`LoggedInUserInfo-tests.tsx\`](https://github.com/artsy/eigen/blob/f33577ebb09800224731365734be411b66ad8126/src/lib/Scenes/MyProfile/__tests__/LoggedInUserInfo-tests.tsx) as an example, or [the docs](https://relay.dev/docs/en/testing-relay-components).
    `)
  }
}

// Validates that we've not accidentally let in a testing
// shortcut to simplify dev work
const verifyRemainingDevWork = () => {
  const modified = danger.git.modified_files
  const editedFiles = modified.concat(danger.git.created_files)
  const testFiles = editedFiles.filter((f) => f?.includes("Tests") && f.match(/\.(swift|m)$/))

  const testingShortcuts = ["fdescribe", "fit(@", "fit("]
  for (const file of testFiles) {
    const content = fs.readFileSync(file).toString()
    for (const shortcut of testingShortcuts) {
      if (content.includes(shortcut)) {
        fail(`Found a testing shortcut in ${file}`)
      }
    }
  }

  // A shortcut to say "I know what I'm doing thanks"
  const knownDevTools = danger.github.pr.body?.includes("#known") ?? false

  // These files are ones we really don't want changes to, except in really occasional
  // cases, so offer a way out.
  const devOnlyFiles = ["Artsy.xcodeproj/xcshareddata/xcschemes/Artsy.xcscheme"]
  for (const file of devOnlyFiles) {
    if (modified.includes(file) && !knownDevTools) {
      fail(
        "Developer Specific file shouldn't be changed, you can skip by adding #known to the PR body and re-running CI"
      )
    }
  }
}

// Ensure the CHANGELOG is set up like we need
const validateChangelogYMLFile = async () => {
  try {
    // Ensure it is valid yaml
    const changelogYML = fs.readFileSync("CHANGELOG.yml").toString()
    const loadedDictionary = yaml.parse(changelogYML)

    // So that we don't accidentally copy & paste oour upcoming section wrong
    const upcoming = loadedDictionary?.upcoming
    if (upcoming) {
      if (Array.isArray(upcoming)) {
        fail("Upcoming an array in the CHANGELOG")
      }

      // Deployments rely on this to send info to reviewers
      else if (typeof upcoming === "object") {
        if (!upcoming.user_facing) {
          fail("There must be a `user_facing` section in the upcoming section of the CHANGELOG")
        }
      }
    }
  } catch (e) {
    fail("The CHANGELOG is not valid YML:\n" + e.stack)
  }
}

// Require changelog on Eigen PRs to be valid
// See Eigen RFC: https://github.com/artsy/eigen/issues/4499
export const validatePRChangelog = () => {
  const pr = danger.github.pr

  const isOpen = pr.state === "open"
  if (!isOpen) {
    console.log("Skipping this check because the PR is not open")
    return
  }

  const content = pr.body

  const res = parsePRDescription(content) as ParseResult

  // TODO: Delete this once we finish the new changelog work
  if (!content.includes("#run_new_changelog_check")) {
    return
  }

  if (res.type === "error") {
    console.log("Something went wrong while parsing the PR description")
    warn("❌ **An error occurred while validating your changelog, please make sure you provided a valid changelog.**")
    return
  }

  if (res.type === "no_changes") {
    console.log("PR has no changes")
    warn("✅ **No changelog changes**")
    return
  }

  // At this point, the PR description changelog changes are valid
  // and res contains a list of the changes
  console.log("PR Changelog is valid")

  const { type, ...changedSections } = res

  const message =
    "### This PR contains the following changes:\n" +
    Object.entries(pickBy(changedSections, (changesArray) => changesArray.length))
      .map(([section, sectionValue]) => {
        return `\n- ${changelogTemplateSections[section as keyof typeof changedSections]} (${sectionValue})`
      })
      .join("")

  return markdown(message)
}
;(async function () {
  preventUsingEnzyme()
  preventUsingRenderRelayTree()
  verifyRemainingDevWork()
  await validateChangelogYMLFile()
  validatePRChangelog()
})()
