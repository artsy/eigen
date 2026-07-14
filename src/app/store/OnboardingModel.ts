import { Action, action } from "easy-peasy"

type OnboardingState = "incomplete" | "complete"
type OnboardingArtQuizState = "none" | "incomplete" | "complete"

export interface OnboardingFollowedArtist {
  internalID: string
  imageUrl: string | null
  blurhash: string | null
  initials: string | null
}

export interface OnboardingModel {
  onboardingState: OnboardingState
  onboardingArtQuizState: OnboardingArtQuizState
  followedOnboardingArtists: OnboardingFollowedArtist[]
  setArtQuizState: Action<this, OnboardingArtQuizState>
  setOnboardingState: Action<this, OnboardingState>
  addFollowedOnboardingArtist: Action<this, OnboardingFollowedArtist>
  removeFollowedOnboardingArtist: Action<this, string>
  resetFollowedOnboardingArtists: Action<this>
  showFollowedArtistSummaryBottomSheet: boolean
  setShowFollowedArtistSummaryBottomSheet: Action<this, boolean>
}

export const getOnboardingModel = (): OnboardingModel => ({
  onboardingState: "incomplete",
  onboardingArtQuizState: "none",
  followedOnboardingArtists: [],
  showFollowedArtistSummaryBottomSheet: false,
  setArtQuizState: action((state, artQuizState) => {
    state.onboardingArtQuizState = artQuizState
  }),
  setOnboardingState: action((state, onboardingState) => {
    state.onboardingState = onboardingState
  }),
  addFollowedOnboardingArtist: action((state, artist) => {
    const alreadyAdded = state.followedOnboardingArtists.some(
      (a) => a.internalID === artist.internalID
    )
    if (!alreadyAdded) {
      state.followedOnboardingArtists.push(artist)
    }
  }),
  removeFollowedOnboardingArtist: action((state, internalID) => {
    state.followedOnboardingArtists = state.followedOnboardingArtists.filter(
      (a) => a.internalID !== internalID
    )
  }),
  resetFollowedOnboardingArtists: action((state) => {
    state.followedOnboardingArtists = []
  }),
  setShowFollowedArtistSummaryBottomSheet: action((state, show) => {
    state.showFollowedArtistSummaryBottomSheet = show
  }),
})
