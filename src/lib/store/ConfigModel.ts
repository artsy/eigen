import { action, Action, computed, Computed } from "easy-peasy"
import { EchoModel, getEchoModel } from "./config/EchoModel"
import { EnvironmentModel, getEnvironmentModel } from "./config/EnvironmentModel"
import { FeaturesModel, getFeaturesModel } from "./config/FeaturesModel"

export interface ConfigModel {
  echo: EchoModel
  features: FeaturesModel
  environment: EnvironmentModel

  userIsDevOverride: boolean | undefined
  userIsDev: Computed<this, boolean>
  setUserIsDevOverride: Action<this, ConfigModel["userIsDevOverride"]>
}

export const getConfigModel = (): ConfigModel => ({
  echo: getEchoModel(),
  features: getFeaturesModel(),
  environment: getEnvironmentModel(),

  userIsDevOverride: undefined,
  userIsDev: computed([(_, store) => store], (store) => {
    return false
  }),
  setUserIsDevOverride: action((state, nextValue) => {
    state.userIsDevOverride = nextValue
  }),
})
