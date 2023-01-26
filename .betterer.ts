import { regexp } from "@betterer/regexp"
import { BettererFileTest } from "@betterer/betterer"

const typescriptFiles = ["./src/**/*.ts", "./src/**/*.tsx"]
const typescriptTestFiles = ["./src/**/*.tests.ts", "./src/**/*.tests.tsx"]
const imageExtensionsToAvoid = ["png", "jpg", "jpeg"]

export default {
  "Stop using useAnimatedValue, use useSharedValue instead!": () =>
    regexp(/useAnimatedValue\(/).include(typescriptFiles),

  "Stop using moment, use luxon instead!": () =>
    regexp(/from "(moment|moment-timezone)"/).include(typescriptFiles),

  "Finish our strictnes migration!": () =>
    regexp(/Unsafe legacy code 🚨 Please delete this/).include(typescriptFiles),

  // "Avoid non-webp images!": () =>
  //   countNonWebpImages().include([`./images/**/*.{${imageExtensionsToAvoid.join(",")}}`]),

  "Avoid using test-renderer!": () =>
    regexp(/renderWithWrappersLEGACY.* from ".*renderWithWrappers"/).include(typescriptTestFiles),

  "Remove all relay unmocks!": () => regexp(/unmock\("react-relay"\)/).include(typescriptTestFiles),

  "Fix all STRICTNESS_MIGRATION!": () => regexp(/STRICTNESS_MIGRATION/).include(typescriptFiles),

  "Avoid having skipped tests!": () =>
    regexp(/(fdescribe\(|describe.only\(|fit\(|xit\(|it.only\(|it.skip\()/).include(
      typescriptTestFiles
    ),

  "Avoid using class components!": () =>
    regexp(/extends (React\.)?Component/).include(typescriptFiles),

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
