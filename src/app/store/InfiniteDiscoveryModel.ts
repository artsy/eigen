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
    isNewUserOnboardingSession: boolean
    newUserOnboardingSavedArtworks: NewUserOnboardingSavedArtwork[]
  }
  incrementSavedArtworksCount: Action<this>
  decrementSavedArtworksCount: Action<this>
  resetSavedArtworksCount: Action<this>
  setHasInteractedWithOnboarding: Action<this, boolean>
  setHasSavedArtworks: Action<this, boolean>
  setMoreInfoSheetVisible: Action<this, boolean>
  setIsNewUserOnboardingSession: Action<this, boolean>
  addNewUserOnboardingSavedArtwork: Action<this, NewUserOnboardingSavedArtwork>
  removeNewUserOnboardingSavedArtwork: Action<this, string>
}

export const getInfiniteDiscoveryModel = (): InfiniteDiscoveryModel => ({
  hasSavedArtworks: false,
  hasInteractedWithOnboarding: false,
  savedArtworksCount: 0,
  sessionState: {
    moreInfoSheetVisible: false,
    isNewUserOnboardingSession: false,
    newUserOnboardingSavedArtworks: [],
  },
  incrementSavedArtworksCount: action((state) => {
    state.savedArtworksCount += 1
  }),
  decrementSavedArtworksCount: action((state) => {
    if (state.savedArtworksCount > 0) state.savedArtworksCount -= 1
  }),
  resetSavedArtworksCount: action((state) => {
    state.savedArtworksCount = 0
    state.sessionState.newUserOnboardingSavedArtworks = []
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
  setIsNewUserOnboardingSession: action((state, payload) => {
    state.sessionState.isNewUserOnboardingSession = payload
  }),
  addNewUserOnboardingSavedArtwork: action((state, payload) => {
    const { newUserOnboardingSavedArtworks } = state.sessionState
    const alreadyAdded = newUserOnboardingSavedArtworks.some(
      (a) => a.internalID === payload.internalID
    )
    if (!alreadyAdded && newUserOnboardingSavedArtworks.length < 5) {
      newUserOnboardingSavedArtworks.push(payload)
    }
  }),
  removeNewUserOnboardingSavedArtwork: action((state, internalID) => {
    state.sessionState.newUserOnboardingSavedArtworks =
      state.sessionState.newUserOnboardingSavedArtworks.filter((a) => a.internalID !== internalID)
  }),
})
