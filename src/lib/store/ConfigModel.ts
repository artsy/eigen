import { action, Action, thunkOn, ThunkOn } from "easy-peasy"
import { LegacyNativeModules } from "lib/NativeModules/LegacyNativeModules"
import { EchoModel, getEchoModel } from "./config/EchoModel"
import { EnvironmentModel, getEnvironmentModel } from "./config/EnvironmentModel"
import { FeaturesModel, getFeaturesModel } from "./config/FeaturesModel"
import { GlobalStoreModel } from "./GlobalStoreModel"

export interface ConfigModel {
  echo: EchoModel
  features: FeaturesModel
  environment: EnvironmentModel

  userIsDev: boolean
  setUserIsDev: Action<
    ConfigModel,
    { nextValue: ConfigModel["userIsDev"]; callback?: (newValue: ConfigModel["userIsDev"]) => void }
  >
  onSetUserIsDev: ThunkOn<ConfigModel, any, GlobalStoreModel>
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
    (_, { payload: { nextValue } }, store) => {
      store.getStoreActions().native.setLocalState({ userIsDev: nextValue })
      LegacyNativeModules.ARNotificationsManager.stateUpdated(store.getStoreState().native.sessionState)
    }
  ),
})
