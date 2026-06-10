import { Action, action } from "easy-peasy"

type OnboardingState = "incomplete" | "complete"
type OnboardingArtQuizState = "none" | "incomplete" | "complete"
type OnboardingDestination = "infinite-discovery" | null

export interface OnboardingModel {
  onboardingState: OnboardingState
  onboardingArtQuizState: OnboardingArtQuizState
  onboardingDestination: OnboardingDestination
  setArtQuizState: Action<this, OnboardingArtQuizState>
  setOnboardingState: Action<this, OnboardingState>
  setOnboardingDestination: Action<this, OnboardingDestination>
}

export const getOnboardingModel = (): OnboardingModel => ({
  onboardingState: "incomplete",
  onboardingArtQuizState: "none",
  onboardingDestination: null,
  setArtQuizState: action((state, artQuizState) => {
    state.onboardingArtQuizState = artQuizState
  }),
  setOnboardingState: action((state, onboardingState) => {
    state.onboardingState = onboardingState
  }),
  setOnboardingDestination: action((state, destination) => {
    state.onboardingDestination = destination
  }),
})
