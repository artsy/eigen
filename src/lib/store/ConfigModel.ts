import { action, Action } from "easy-peasy"
import { EchoModel, getEchoModel } from "./config/EchoModel"
import { EnvironmentModel, getEnvironmentModel } from "./config/EnvironmentModel"
import { FeaturesModel, getFeaturesModel } from "./config/FeaturesModel"

export interface ConfigModel {
  echo: EchoModel
  features: FeaturesModel
  environment: EnvironmentModel

  userIsDev: boolean
  setUserIsDev: Action<
    ConfigModel,
    { nextValue: ConfigModel["userIsDev"]; callback?: (newValue: ConfigModel["userIsDev"]) => void }
  >
}

export const getConfigModel = (): ConfigModel => ({
  echo: getEchoModel(),
  features: getFeaturesModel(),
  environment: getEnvironmentModel(),

  userIsDev: false,
  setUserIsDev: action((state, { nextValue, callback }) => {
    state.userIsDev = nextValue
    callback?.(state.userIsDev)
  }),
})
