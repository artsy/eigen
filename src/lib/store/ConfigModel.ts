import { action, Action, thunkOn, ThunkOn } from "easy-peasy"
import { LegacyNativeModules } from "lib/NativeModules/LegacyNativeModules"
import { is__DEV__ } from "lib/utils/general"
import { EchoModel, getEchoModel } from "./config/EchoModel"
import { EnvironmentModel, getEnvironmentModel } from "./config/EnvironmentModel"
import { FeaturesModel, getFeaturesModel } from "./config/FeaturesModel"

export interface ConfigModel {
  echo: EchoModel
  features: FeaturesModel
  environment: EnvironmentModel
}

export const getConfigModel = (): ConfigModel => ({
  echo: getEchoModel(),
  features: getFeaturesModel(),
  environment: getEnvironmentModel(),
})
