import {
  checkNativeStatus,
  formatGithubOutputs,
  parseFingerprint,
  touchesNativeInputs,
} from "../nativeStatus"

const A = parseFingerprint({ value: "a".repeat(40), label: "A" })
const B = parseFingerprint({ value: "b".repeat(40), label: "B" })
const C = parseFingerprint({ value: "c".repeat(40), label: "C" })

describe("checkNativeStatus", () => {
  it("is level when nothing changed", () => {
    expect(checkNativeStatus({ base: A, pr: A, main: A })).toEqual("level")
  })

  it("is ahead when only the PR changed native code", () => {
    expect(checkNativeStatus({ base: A, pr: B, main: A })).toEqual("ahead")
  })

  it("is behind when only main changed native code", () => {
    expect(checkNativeStatus({ base: A, pr: A, main: B })).toEqual("behind")
  })

  it("is ahead when the PR changed native code and main moved too", () => {
    expect(checkNativeStatus({ base: A, pr: B, main: C })).toEqual("ahead")
  })

  it("is level when the PR carries the same native change main has", () => {
    expect(checkNativeStatus({ base: A, pr: B, main: B })).toEqual("level")
  })
})

describe("parseFingerprint", () => {
  it("returns the trimmed fingerprint", () => {
    expect(parseFingerprint({ value: `${A}\n`, label: "test" })).toEqual(A)
  })

  it.each([
    ["undefined", undefined],
    ["null", null],
    ["a number", 94],
    ["empty", ""],
    ["too short", "abc123"],
    ["uppercase", "F".repeat(40)],
    ["not hex", "r".repeat(40)],
  ])("rejects %s", (_, value) => {
    expect(() => parseFingerprint({ value, label: "--base" })).toThrow(
      "--base is not a 40-character"
    )
  })
})

describe("formatGithubOutputs", () => {
  it("writes one key=value line per entry", () => {
    expect(formatGithubOutputs({ status: "level", fp_pr: A })).toEqual(`status=level\nfp_pr=${A}\n`)
  })
})

describe("touchesNativeInputs", () => {
  it("is false when only src/ changed", () => {
    expect(touchesNativeInputs(["src/app/Scenes/Sell/Sell.tsx", "src/app/utils/date.ts"])).toBe(
      false
    )
  })

  it("is false for src/, data/, docs/ and markdown files", () => {
    expect(
      touchesNativeInputs([
        "src/app/App.tsx",
        "data/schema.graphql",
        "docs/testing.md",
        "README.md",
      ])
    ).toBe(false)
  })

  it("is false when nothing changed", () => {
    expect(touchesNativeInputs([])).toBe(false)
  })

  it.each([
    "package.json",
    "yarn.lock",
    "app.json",
    "react-native.config.js",
    "ios/Artsy/AppDelegate.swift",
    "android/app/build.gradle",
    "patches/react-native+0.79.0.patch",
    ".github/actions/setup-node/action.yml",
  ])("is true when %s changed", (path) => {
    expect(touchesNativeInputs(["src/app/App.tsx", path])).toBe(true)
  })

  it("matches whole folder names, not prefixes", () => {
    expect(touchesNativeInputs(["srcfoo/index.js"])).toBe(true)
  })
})
