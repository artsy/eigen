import { EchoModel, getEchoModel } from "./config/EchoModel"
import { ExperimentsModel, getExperimentsModel } from "./config/ExperimentsModel"
import { FeaturesModel, getFeaturesModel } from "./config/FeaturesModel"
import { getUserIsDev, UserIsDevModel } from "./config/UserIsDevModel"

export interface ArtsyPrefsModel {
  echo: EchoModel
  features: FeaturesModel
  userIsDev: UserIsDevModel
  experiments: ExperimentsModel
}

export const getArtsyPrefsModel = (): ArtsyPrefsModel => ({
  echo: getEchoModel(),
  features: getFeaturesModel(),
  userIsDev: getUserIsDev(),
  experiments: getExperimentsModel(),
})
