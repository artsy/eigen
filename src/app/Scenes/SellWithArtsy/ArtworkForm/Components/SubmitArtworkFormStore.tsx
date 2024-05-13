import {
  ARTWORK_FORM_STEPS,
  SubmitArtworkScreen,
} from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/constants"
import { Action, action, createContextStore } from "easy-peasy"

export interface SubmitArtworkFormStoreModel {
  currentStep: SubmitArtworkScreen
  isLoading: boolean
  setCurrentStep: Action<this, SubmitArtworkScreen>
  setIsLoading: Action<this, boolean>
}

export const SubmitArtworkFormStoreModel: SubmitArtworkFormStoreModel = {
  currentStep: ARTWORK_FORM_STEPS[0],
  isLoading: false,
  setCurrentStep: action((state, payload) => {
    state.currentStep = payload
  }),
  setIsLoading: action((state, payload) => {
    state.isLoading = payload
  }),
}

export const SubmitArtworkFormStore = createContextStore((injections) => ({
  ...SubmitArtworkFormStoreModel,
  ...injections,
}))

export const SubmitArtworkFormStoreProvider = SubmitArtworkFormStore.Provider
