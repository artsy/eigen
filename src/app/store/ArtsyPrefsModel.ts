import { PushPromptLogicModel, getPushPromptLogicModel } from "app/store/PushPromptLogicModel"
import { EchoModel, getEchoModel } from "./config/EchoModel"
import { ExperimentsModel, getExperimentsModel } from "./config/ExperimentsModel"
import { FeaturesModel, getFeaturesModel } from "./config/FeaturesModel"
import { getPreviewPRModel, PreviewPRModel } from "./config/PreviewPRModel"
import { getUserIsDev, UserIsDevModel } from "./config/UserIsDevModel"

export interface ArtsyPrefsModel {
  echo: EchoModel
  features: FeaturesModel
  userIsDev: UserIsDevModel
  experiments: ExperimentsModel
  pushPromptLogic: PushPromptLogicModel
  previewPR: PreviewPRModel
}

export const getArtsyPrefsModel = (): ArtsyPrefsModel => ({
  echo: getEchoModel(),
  features: getFeaturesModel(),
  userIsDev: getUserIsDev(),
  experiments: getExperimentsModel(),
  pushPromptLogic: getPushPromptLogicModel(),
  previewPR: getPreviewPRModel(),
})
