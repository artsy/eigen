import { EchoModel, getEchoModel } from "./config/EchoModel"
import { EnvironmentModel, getEnvironmentModel } from "./config/EnvironmentModel"
import { ExperimentsModel, getExperimentsModel } from "./config/ExperimentsModel"
import { FeaturesModel, getFeaturesModel } from "./config/FeaturesModel"
import { getUserIsDev, UserIsDevModel } from "./config/UserIsDevModel"

export interface ArtsyPrefsModel {
  echo: EchoModel
  environment: EnvironmentModel
  features: FeaturesModel
  userIsDev: UserIsDevModel
  experiments: ExperimentsModel
}

export const getArtsyPrefsModel = (): ArtsyPrefsModel => ({
  echo: getEchoModel(),
  environment: getEnvironmentModel(),
  features: getFeaturesModel(),
  userIsDev: getUserIsDev(),
  experiments: getExperimentsModel(),
})
