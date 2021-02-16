import { env } from "process"
import echoLaunchJSON from "../../../../../Artsy/App/EchoNew.json"
import { features } from "../features"

Object.entries(features).forEach(([key, val]) => {
  describe(`The ${key} feature`, () => {
    if (val.echoFlagKey) {
      it(`uses an echo flag named ${key}`, () => {
        if (!echoLaunchJSON.features.find((flag) => flag.name === key)) {
          throw new Error(
            `No echo flag found for key ${key}. ` +
              (env.CI === "true"
                ? "Make sure you added it to the echo repo"
                : "Make sure you added it to the echo repo and updated your local copy of echo with ./scripts/update-echo")
          )
        }
      })
    }
  })
})
