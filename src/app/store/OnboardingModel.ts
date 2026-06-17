import { Action, action } from "easy-peasy"

type OnboardingState = "incomplete" | "complete"
type OnboardingArtQuizState = "none" | "incomplete" | "complete"

export interface OnboardingModel {
  onboardingState: OnboardingState
  onboardingArtQuizState: OnboardingArtQuizState
  setArtQuizState: Action<this, OnboardingArtQuizState>
  setOnboardingState: Action<this, OnboardingState>
  showArtistSaveBottomSheet: boolean
  setShowArtistSaveBottomSheet: Action<this, boolean>
}

export const getOnboardingModel = (): OnboardingModel => ({
  onboardingState: "incomplete",
  onboardingArtQuizState: "none",
  showArtistSaveBottomSheet: false,
  setArtQuizState: action((state, artQuizState) => {
    state.onboardingArtQuizState = artQuizState
  }),
  setOnboardingState: action((state, onboardingState) => {
    state.onboardingState = onboardingState
  }),
  setShowArtistSaveBottomSheet: action((state, show) => {
    state.showArtistSaveBottomSheet = show
  }),
})
