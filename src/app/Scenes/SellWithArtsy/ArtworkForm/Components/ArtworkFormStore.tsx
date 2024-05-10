import {
  ARTWORK_FORM_STEPS,
  ArtworkFormStep,
} from "app/Scenes/SellWithArtsy/ArtworkForm/SubmissionArtworkForm"
import { Action, action, createContextStore } from "easy-peasy"

export interface ArtworkFormStoreModel {
  currentStep: ArtworkFormStep
  isLoading: boolean
  setCurrentStep: Action<this, ArtworkFormStep>
  setIsLoading: Action<this, boolean>
}

export const ArtworkFormStoreModel: ArtworkFormStoreModel = {
  currentStep: ARTWORK_FORM_STEPS[0],
  isLoading: false,
  setCurrentStep: action((state, payload) => {
    state.currentStep = payload
  }),
  setIsLoading: action((state, payload) => {
    state.isLoading = payload
  }),
}

export const ArtworkFormStore = createContextStore((injections) => ({
  ...ArtworkFormStoreModel,
  ...injections,
}))

export const ArtworkFormStoreProvider = ArtworkFormStore.Provider
