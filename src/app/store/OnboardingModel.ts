import { Action, action } from "easy-peasy"

type OnboardingState = "incomplete" | "complete"
type OnboardingArtQuizState = "none" | "incomplete" | "complete"

export interface OnboardingModel {
  onboardingState: OnboardingState
  onboardingArtQuizState: OnboardingArtQuizState
  setArtQuizState: Action<this, OnboardingArtQuizState>
  setOnboardingState: Action<this, OnboardingState>
  showFollowedArtistSummaryBottomSheet: boolean
  setShowFollowedArtistSummaryBottomSheet: Action<this, boolean>
}

export const getOnboardingModel = (): OnboardingModel => ({
  onboardingState: "incomplete",
  onboardingArtQuizState: "none",
  showFollowedArtistSummaryBottomSheet: false,
  setArtQuizState: action((state, artQuizState) => {
    state.onboardingArtQuizState = artQuizState
  }),
  setOnboardingState: action((state, onboardingState) => {
    state.onboardingState = onboardingState
  }),
  setShowFollowedArtistSummaryBottomSheet: action((state, show) => {
    state.showFollowedArtistSummaryBottomSheet = show
  }),
})
