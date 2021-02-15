import { EchoModel } from "./config/EchoModel"
import { EnvironmentModel } from "./config/EnvironmentModel"
import { FeaturesModel } from "./config/FeaturesModel"

export interface ConfigModel {
  echo: EchoModel
  features: FeaturesModel
  environment: EnvironmentModel
}
export const ConfigModel: ConfigModel = {
  echo: EchoModel,
  features: FeaturesModel,
  environment: EnvironmentModel,
}
