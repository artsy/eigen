import { danger, fail, warn } from "danger"
// TypeScript thinks we're in React Native,
// so the node API gives us errors:
import * as fs from "fs"

/**
 * Helpers
 */
const typescriptOnly = (file: string) => file.includes(".ts")
const filesOnly = (file: string) => fs.existsSync(file) && fs.lstatSync(file).isFile()

// Modified or Created can be treated the same a lot of the time
const getCreatedFileNames = (createdFiles: string[]) => createdFiles.filter(filesOnly)

const testOnlyFilter = (filename: string) => filename.includes(".tests") && typescriptOnly(filename)

/**
 * Danger Rules
 */
// We are trying to migrate away from moment towards luxon
const preventUsingMoment = () => {
  const newMomentImports = getCreatedFileNames(danger.git.created_files).filter((filename) => {
    const content = fs.readFileSync(filename).toString()
    return content.includes('from "moment"') || content.includes('from "moment-timezone"')
  })
  if (newMomentImports.length > 0) {
    warn(`We are trying to migrate away from moment towards \`luxon\`, but found moment imports in the following new files:

${newMomentImports.map((filename) => `- \`${filename}\``).join("\n")}

See [docs](https://moment.github.io/luxon/api-docs/index.html).
  `)
  }
}

// We are trying to migrate away from Enzyme towards @testing-library/react-native
const preventUsingEnzyme = () => {
  const newEnzymeImports = getCreatedFileNames(danger.git.created_files)
    .filter(testOnlyFilter)
    .filter((filename) => {
      const content = fs.readFileSync(filename).toString()
      return content.includes('from "enzyme"')
    })
  if (newEnzymeImports.length > 0) {
    warn(`We are trying to migrate away from Enzyme towards \`@testing-library/react-native\`, but found Enzyme imports in the following new unit test files:

${newEnzymeImports.map((filename) => `- \`${filename}\``).join("\n")}

See [\`Pill.tests.tsx\`](https://github.com/artsy/eigen/blob/2f32d462bb3b4ce358c8a14e3ed09b42523de8bd/src/palette/elements/Pill/__tests__/Pill-tests.tsx) as an example, or [the docs](https://callstack.github.io/react-native-testing-library/docs/api-queries).
  `)
  }
}

// We are trying to migrate away from test-renderer towards @testing-library/react-native
const preventUsingTestRenderer = () => {
  const newTRImports = getCreatedFileNames(danger.git.created_files)
    .filter(testOnlyFilter)
    .filter((filename) => {
      const content = fs.readFileSync(filename).toString()
      return (
        content.includes('from "app/tests/renderWithWrappers"') &&
        (content.includes("renderWithWrappers ") || content.includes("renderWithWrappers,"))
      )
    })
  if (newTRImports.length > 0) {
    warn(`We are trying to migrate away from \`react-test-renderer\` towards \`@testing-library/react-native\`, but found Test-Renderer imports in the following new unit test files:

${newTRImports.map((filename) => `- \`${filename}\``).join("\n")}

See [\`Pill.tests.tsx\`](https://github.com/artsy/eigen/blob/2f32d462bb3b4ce358c8a14e3ed09b42523de8bd/src/palette/elements/Pill/__tests__/Pill-tests.tsx) as an example, or [the docs](https://callstack.github.io/react-native-testing-library/docs/api-queries).
  `)
  }
}

const preventUsingRenderRelayTree = () => {
  const newRenderRelayTreeImports = getCreatedFileNames(danger.git.created_files)
    .filter(testOnlyFilter)
    .filter((filename) => {
      const content = fs.readFileSync(filename).toString()
      return content.includes('from "app/tests/renderRelayTree"')
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

  const testingShortcuts = ["fdescribe(", "describe.only(", "fit(", "fit(", "it.only("]
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

// Force the usage of WebPs
const IMAGE_EXTENSIONS_TO_AVOID = ["png", "jpg", "jpeg"]
const IMAGE_EXTENSIONS = [...IMAGE_EXTENSIONS_TO_AVOID, "webp"]

export const useWebPs = (fileNames: string[]) => {
  const hasNonWebImages = Boolean(
    fileNames
      .map((fileName) => fileName.split(".").pop() || "")
      .filter((fileExtension) => {
        return IMAGE_EXTENSIONS.includes(fileExtension)
      })
      .find((imageFileExtension) => IMAGE_EXTENSIONS_TO_AVOID.includes(imageFileExtension))
  )

  if (hasNonWebImages) {
    warn(
      "❌ **It seems like you added some non WebP images to Eigen, please convert them to WebPs using `source images/script.sh` script **"
    )
  }
}
;(async function () {
  const newCreatedFileNames = getCreatedFileNames(danger.git.created_files)

  preventUsingMoment()
  preventUsingEnzyme()
  preventUsingTestRenderer()
  preventUsingRenderRelayTree()
  verifyRemainingDevWork()
  useWebPs(newCreatedFileNames)
})()
