import { intersection } from "lodash"
import { env } from "process"
import echoLaunchJSON from "../../../../../Artsy/App/EchoNew.json"
import { devToggles, features } from "../features"

Object.entries(features).forEach(([key, val]) => {
  describe(`The ${key} feature`, () => {
    if (val.echoFlagKey) {
      it(`uses an echo flag named ${key}`, () => {
        if (!echoLaunchJSON.features.some((flag) => flag.name === val.echoFlagKey)) {
          throw new Error(
            `No echo flag found for key ${val.echoFlagKey}. ` +
              (env.CI === "true"
                ? "Make sure you added it to the echo repo"
                : "Make sure you added it to the echo repo and updated your local copy of echo with ./scripts/update-echo")
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
