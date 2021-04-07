import { action, Action, computed, Computed } from "easy-peasy"
import { is__DEV__ } from "lib/utils/general"
import { EchoModel, getEchoModel } from "./config/EchoModel"
import { EnvironmentModel, getEnvironmentModel } from "./config/EnvironmentModel"
import { FeaturesModel, getFeaturesModel } from "./config/FeaturesModel"
import { GlobalStoreModel } from "./GlobalStoreModel"

export interface ConfigModel {
  echo: EchoModel
  features: FeaturesModel
  environment: EnvironmentModel

  userIsDevFlipValue: boolean
  userIsDev: Computed<this, boolean, GlobalStoreModel>
  setUserIsDevFlipValue: Action<this, ConfigModel["userIsDevFlipValue"]>
}

export const getConfigModel = (): ConfigModel => ({
  echo: getEchoModel(),
  features: getFeaturesModel(),
  environment: getEnvironmentModel(),

  userIsDevFlipValue: false,
  userIsDev: computed([(_, store) => store], (store) => {
    if (is__DEV__()) {
      return true
    }
    if (store.auth.userHasArtsyEmail) {
      return true
    }
    return false
  }),
  setUserIsDevFlipValue: action((state, nextValue) => {
    state.userIsDevFlipValue = nextValue
  }),
})
