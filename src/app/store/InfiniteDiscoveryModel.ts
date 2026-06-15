import { Action, action } from "easy-peasy"

export interface OnboardingSavedArtworkImage {
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
    isOnboardingSession: boolean
    onboardingSavedArtworkImages: OnboardingSavedArtworkImage[]
  }
  incrementSavedArtworksCount: Action<this>
  decrementSavedArtworksCount: Action<this>
  resetSavedArtworksCount: Action<this>
  setHasInteractedWithOnboarding: Action<this, boolean>
  setHasSavedArtworks: Action<this, boolean>
  setMoreInfoSheetVisible: Action<this, boolean>
  setIsOnboardingSession: Action<this, boolean>
  addOnboardingSavedArtworkImage: Action<this, OnboardingSavedArtworkImage>
  removeOnboardingSavedArtworkImage: Action<this, string>
}

export const getInfiniteDiscoveryModel = (): InfiniteDiscoveryModel => ({
  hasSavedArtworks: false,
  hasInteractedWithOnboarding: false,
  savedArtworksCount: 0,
  sessionState: {
    moreInfoSheetVisible: false,
    isOnboardingSession: false,
    onboardingSavedArtworkImages: [],
  },
  incrementSavedArtworksCount: action((state) => {
    state.savedArtworksCount += 1
  }),
  decrementSavedArtworksCount: action((state) => {
    if (state.savedArtworksCount > 0) state.savedArtworksCount -= 1
  }),
  resetSavedArtworksCount: action((state) => {
    state.savedArtworksCount = 0
    state.sessionState.onboardingSavedArtworkImages = []
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
  setIsOnboardingSession: action((state, payload) => {
    state.sessionState.isOnboardingSession = payload
  }),
  addOnboardingSavedArtworkImage: action((state, payload) => {
    const { onboardingSavedArtworkImages } = state.sessionState
    const alreadyAdded = onboardingSavedArtworkImages.some(
      (a) => a.internalID === payload.internalID
    )
    if (!alreadyAdded && onboardingSavedArtworkImages.length < 5) {
      onboardingSavedArtworkImages.push(payload)
    }
  }),
  removeOnboardingSavedArtworkImage: action((state, internalID) => {
    state.sessionState.onboardingSavedArtworkImages =
      state.sessionState.onboardingSavedArtworkImages.filter((a) => a.internalID !== internalID)
  }),
})
