import {
  ARTWORK_FORM_STEPS,
  ArtworkFormStep,
} from "app/Scenes/SellWithArtsy/ArtworkForm/SubmissionArtworkForm"
import { Action, action, createContextStore } from "easy-peasy"

export interface ArtworkFormStoreModel {
  currentStep: ArtworkFormStep
  setCurrentStep: Action<this, ArtworkFormStep>
}

export const ArtworkFormStoreModel: ArtworkFormStoreModel = {
  currentStep: ARTWORK_FORM_STEPS[0],
  setCurrentStep: action((state, payload) => {
    state.currentStep = payload
  }),
}

export const ArtworkFormStore = createContextStore((injections) => ({
  ...ArtworkFormStoreModel,
  ...injections,
}))

export const ArtworkFormStoreProvider = ArtworkFormStore.Provider
