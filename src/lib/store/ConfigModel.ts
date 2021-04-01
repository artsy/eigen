import { action, Action, thunkOn, ThunkOn } from "easy-peasy"
import { LegacyNativeModules } from "lib/NativeModules/LegacyNativeModules"
import { EchoModel, getEchoModel } from "./config/EchoModel"
import { EnvironmentModel, getEnvironmentModel } from "./config/EnvironmentModel"
import { FeaturesModel, getFeaturesModel } from "./config/FeaturesModel"
import { unsafe__getEnvironment } from "./GlobalStore"

export interface ConfigModel {
  echo: EchoModel
  features: FeaturesModel
  environment: EnvironmentModel

  userIsDev: boolean
  setUserIsDev: Action<
    ConfigModel,
    { nextValue: ConfigModel["userIsDev"]; callback?: (newValue: ConfigModel["userIsDev"]) => void }
  >
  onSetUserIsDev: ThunkOn<ConfigModel>
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
  onSetUserIsDev: thunkOn(
    (actions) => actions.setUserIsDev,
    () => {
      LegacyNativeModules.ARNotificationsManager.reactStateUpdated(unsafe__getEnvironment())
    }
  ),
})
