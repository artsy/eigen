import { Action, action } from "easy-peasy"

export interface NewUserOnboardingSavedArtwork {
  internalID: string
  url: string
  blurhash?: string | null
}

export interface InfiniteDiscoveryModel {
  hasSavedArtworks: boolean
  hasInteractedWithOnboarding: boolean
  savedArtworksCount: number
  sessionState: {
    moreInfoSheetVisible: boolean
    newUserOnboardingSavedArtworks: NewUserOnboardingSavedArtwork[]
    newUserOnboardingGoalSnapshot: NewUserOnboardingSavedArtwork[]
    newUserOnboardingCompletionBottomSheetVisible: boolean
    newUserOnboardingGoalReached: boolean
  }
  incrementSavedArtworksCount: Action<this>
  decrementSavedArtworksCount: Action<this>
  resetSavedArtworksCount: Action<this>
  resetNewUserOnboardingSessionState: Action<this>
  setHasInteractedWithOnboarding: Action<this, boolean>
  setHasSavedArtworks: Action<this, boolean>
  setMoreInfoSheetVisible: Action<this, boolean>
  setNewUserOnboardingCompletionBottomSheetVisible: Action<this, boolean>
  addNewUserOnboardingSavedArtwork: Action<this, NewUserOnboardingSavedArtwork>
  removeNewUserOnboardingSavedArtwork: Action<this, string>
}

export const getInfiniteDiscoveryModel = (): InfiniteDiscoveryModel => ({
  hasSavedArtworks: false,
  hasInteractedWithOnboarding: false,
  savedArtworksCount: 0,
  sessionState: {
    moreInfoSheetVisible: false,
    newUserOnboardingSavedArtworks: [],
    newUserOnboardingGoalSnapshot: [],
    newUserOnboardingCompletionBottomSheetVisible: false,
    newUserOnboardingGoalReached: false,
  },
  incrementSavedArtworksCount: action((state) => {
    state.savedArtworksCount += 1
  }),
  decrementSavedArtworksCount: action((state) => {
    if (state.savedArtworksCount > 0) state.savedArtworksCount -= 1
  }),
  resetSavedArtworksCount: action((state) => {
    state.savedArtworksCount = 0
  }),
  resetNewUserOnboardingSessionState: action((state) => {
    state.sessionState.newUserOnboardingSavedArtworks = []
    state.sessionState.newUserOnboardingGoalSnapshot = []
    state.sessionState.newUserOnboardingCompletionBottomSheetVisible = false
    state.sessionState.newUserOnboardingGoalReached = false
  }),
  setHasInteractedWithOnboarding: action((state, payload) => {
    state.hasInteractedWithOnboarding = payload
  }),
  setHasSavedArtworks: action((state, payload) => {
    state.hasSavedArtworks = payload
  }),
  setMoreInfoSheetVisible: action((state, payload) => {
    state.sessionState.moreInfoSheetVisible = payload
  }),
  setNewUserOnboardingCompletionBottomSheetVisible: action((state, payload) => {
    state.sessionState.newUserOnboardingCompletionBottomSheetVisible = payload
  }),
  addNewUserOnboardingSavedArtwork: action((state, payload) => {
    const { newUserOnboardingSavedArtworks } = state.sessionState
    const alreadyAdded = newUserOnboardingSavedArtworks.some(
      (a) => a.internalID === payload.internalID
    )
    if (alreadyAdded) {
      return
    }

    newUserOnboardingSavedArtworks.push(payload)

    if (
      !state.sessionState.newUserOnboardingGoalReached &&
      newUserOnboardingSavedArtworks.length === 5
    ) {
      state.sessionState.newUserOnboardingCompletionBottomSheetVisible = true
      state.sessionState.newUserOnboardingGoalReached = true
      // Keep a snapshot of the saved artworks when the onboarding goal was reached.
      // Used in the post-onboarding animation in case the user goes back and unsaves them.
      state.sessionState.newUserOnboardingGoalSnapshot = [...newUserOnboardingSavedArtworks]
    }
  }),
  removeNewUserOnboardingSavedArtwork: action((state, internalID) => {
    state.sessionState.newUserOnboardingSavedArtworks =
      state.sessionState.newUserOnboardingSavedArtworks.filter((a) => a.internalID !== internalID)
  }),
})
