import { regexp } from "@betterer/regexp"
import recursiveReadDirSync from "recursive-readdir-sync"
import { BettererTest, BettererFileTest } from "@betterer/betterer"
import { bigger, smaller } from "@betterer/constraints"

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

  "Avoid non-webp images!": () =>
    countNonWebpImages().include([`./images/**/*.{${imageExtensionsToAvoid.join(",")}}`]),

  "Avoid using test-renderer!": () =>
    regexp(/renderWithWrappersLEGACY.* from ".*renderWithWrappers"/).include(typescriptTestFiles),

  "Avoid having skipped tests!": () =>
    regexp(/(fdescribe\(|describe.only\(|fit\(|xit\(|it.only\(|it.skip\()/).include(
      typescriptTestFiles
    ),
}

const countNonWebpImages = () =>
  new BettererFileTest(async (filePaths, fileTestResult) => {
    filePaths.forEach((filePath) => {
      // the file contents don't matter
      const file = fileTestResult.addFile(filePath, "")
      file.addIssue(
        0,
        0,
        "don't use non-webp images. you can use the script to convert other formats to webp."
      )
    })
  })
