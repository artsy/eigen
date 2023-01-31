import { regexp } from "@betterer/regexp"
import { BettererFileTest } from "@betterer/betterer"

const typescriptFiles = ["./src/**/*.ts", "./src/**/*.tsx"]
const typescriptTestFiles = ["./src/**/*.tests.ts", "./src/**/*.tests.tsx"]
// const imageExtensionsToAvoid = ["png", "jpg", "jpeg"]

export default {
  "Stop using useAnimatedValue, use useSharedValue instead": () =>
    regexp(
      /useAnimatedValue\(/,
      "`useAnimatedValue` is for reanimated v1. Use v2's `useSharedValue`."
    ).include(typescriptFiles),

  "Stop using moment, use luxon instead": () =>
    regexp(
      /from "(moment|moment-timezone)"/,
      "We are migrating away from `moment`, towards `luxon`."
    ).include(typescriptFiles),

  "Finish our strictness migration": () =>
    regexp(
      /Unsafe legacy code 🚨 Please delete this/,
      "These comments were added when we switched on TypeScript's strict mode, and their number should only ever go down."
    ).include(typescriptFiles),

  // "Avoid non-webp images": () =>
  //   countNonWebpImages().include([`./images/**/*.{${imageExtensionsToAvoid.join(",")}}`]),

  "Avoid using test-renderer": () =>
    regexp(
      /renderWithWrappersLEGACY.* from ".*renderWithWrappers"/,
      "We are migrating away from `react-test-renderer`, towards `@testing-library/react-native`."
    ).include(typescriptTestFiles),

  "Fix all STRICTNESS_MIGRATION": () =>
    regexp(
      /STRICTNESS_MIGRATION/,
      "These comments were added when we switched on TypeScript's strict mode, and their number should only ever go down."
    ).include(typescriptFiles),

  "Avoid having skipped tests": () =>
    regexp(
      /(fdescribe\(|describe.only\(|fit\(|xit\(|it.only\(|it.skip\()/,
      "Is this skipped on purpose, or accidentally?"
    ).include(typescriptTestFiles),

  "Avoid using class components": () =>
    regexp(/extends (React\.)?Component/, "Try using a functional component.").include(
      typescriptFiles
    ),

  "Extract palette": () => regexp(/from "palette"/).include(typescriptFiles),
}

// const countNonWebpImages = () =>
//   new BettererFileTest(async (filePaths, fileTestResult) => {
//     filePaths.forEach((filePath) => {
//       // the file contents don't matter
//       const file = fileTestResult.addFile(filePath, "")
//       file.addIssue(
//         0,
//         0,
//         "don't use non-webp images. you can use the script to convert other formats to webp."
//       )
//     })
//   })
