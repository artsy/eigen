import { EchoModel, getEchoModel } from "./config/EchoModel"
import { EnvironmentModel, getEnvironmentModel } from "./config/EnvironmentModel"
import { FeaturesModel, getFeaturesModel } from "./config/FeaturesModel"
import { getUserIsDev, UserIsDevModel } from "./config/UserIsDevModel"
import { ConsignmentsModel, getConsignmentsModel } from "./ConsignmentModel"

export interface ConfigModel {
  consignmentsModel: ConsignmentsModel
  echo: EchoModel
  environment: EnvironmentModel
  features: FeaturesModel
  userIsDev: UserIsDevModel
}

export const getConfigModel = (): ConfigModel => ({
  consignmentsModel: getConsignmentsModel(),
  echo: getEchoModel(),
  environment: getEnvironmentModel(),
  features: getFeaturesModel(),
  userIsDev: getUserIsDev(),
})
