import { Action, action } from "easy-peasy"

type OnboardingState = "none" | "incomplete" | "complete"
type OnboardingArtQuizState = "none" | "incomplete" | "complete"

export interface OnboardingModel {
  onboardingState: OnboardingState
  onboardingArtQuizState: OnboardingArtQuizState
  setArtQuizState: Action<this, OnboardingArtQuizState>
  setOnboardingState: Action<this, OnboardingState>
}

export const getOnboardingModel = (): OnboardingModel => ({
  onboardingState: "incomplete",
  onboardingArtQuizState: "none",
  setArtQuizState: action((state, artQuizState) => {
    state.onboardingArtQuizState = artQuizState
  }),
  setOnboardingState: action((state, onboardingState) => {
    state.onboardingState = onboardingState
  }),
})
