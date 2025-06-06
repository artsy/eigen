import { env } from "process"
import { devToggles, features } from "app/store/config/features"
import { echoLaunchJson } from "app/utils/jsonFiles"
import { intersection } from "lodash"

Object.entries(features).forEach(([key, val]) => {
  describe(`The ${key} feature`, () => {
    if (val.readyForRelease) {
      it(`uses an echo flag named ${key}`, () => {
        if (!echoLaunchJson().features.some((flag) => flag.name === val.echoFlagKey)) {
          throw new Error(
            `No echo flag found for key ${val.echoFlagKey}. ` +
              (env.CI === "true"
                ? "Make sure you added it to the echo repo"
                : "Make sure you added it to the echo repo and updated your local copy of echo with ./scripts/setup/update-echo")
          )
        }
      })
    }
  })
})

describe("features and devToggles", () => {
  it("never have the same keys", () => {
    const featureKeys = Object.keys(features)
    const devToggleKeys = Object.keys(devToggles)

    const common = intersection(featureKeys, devToggleKeys)
    expect(common).toStrictEqual([])
  })
})

describe("feature conventions", () => {
  /**
   * These are pretty silly tests:
   * - enforcing a convention
   * - a file location
   * - something that is already enforced with typescript
   * They are meant to protect this script from breaking:
   * ./scripts/check-flag.js, if you want to update these conventions
   * please also update the script!
   */
  it("should start with AR prefix", () => {
    const featureKeys = Object.keys(features)
    const prefixedKeys = featureKeys.filter((key) => key.startsWith("AR"))
    expect(featureKeys.length).toEqual(prefixedKeys.length)
  })
  it("should contain a key named readyForRelease", () => {
    Object.entries(features).forEach(([_, val]) => {
      expect(val["readyForRelease"]).toBeDefined()
    })
  })
  it("should be located in expected directory", () => {
    expect(__dirname).toContain("src/app/store/config")
    expect(__filename).toContain("features.tests.ts")
  })
})
