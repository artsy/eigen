import { Action, action } from "easy-peasy"

export interface InfiniteDiscoveryModel {
  hasSavedArtworks: boolean
  hasInteractedWithOnboarding: boolean
  savedArtworksCount: number
  // Image URLs of the last 5 saved artworks (most recent first) — used by the home screen animation
  savedArtworkImageUrls: string[]
  // Set to true when the user exits Infinite Discovery with saves — triggers home screen animation
  hasPendingCompletionAnimation: boolean
  sessionState: {
    moreInfoSheetVisible: boolean
  }
  incrementSavedArtworksCount: Action<this>
  decrementSavedArtworksCount: Action<this>
  resetSavedArtworksCount: Action<this>
  setHasInteractedWithOnboarding: Action<this, boolean>
  setHasSavedArtworks: Action<this, boolean>
  setMoreInfoSheetVisible: Action<this, boolean>
  addSavedArtworkImageUrl: Action<this, string>
  resetSavedArtworkImageUrls: Action<this>
  setHasPendingCompletionAnimation: Action<this, boolean>
}

export const getInfiniteDiscoveryModel = (): InfiniteDiscoveryModel => ({
  hasSavedArtworks: false,
  hasInteractedWithOnboarding: false,
  savedArtworksCount: 0,
  savedArtworkImageUrls: [],
  hasPendingCompletionAnimation: false,
  sessionState: {
    moreInfoSheetVisible: false,
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
  setHasInteractedWithOnboarding: action((state, payload) => {
    state.hasInteractedWithOnboarding = payload
  }),
  setHasSavedArtworks: action((state, payload) => {
    state.hasSavedArtworks = payload
  }),
  setMoreInfoSheetVisible: action((state, payload) => {
    state.sessionState.moreInfoSheetVisible = payload
  }),
  addSavedArtworkImageUrl: action((state, url) => {
    state.savedArtworkImageUrls = [url, ...state.savedArtworkImageUrls].slice(0, 5)
  }),
  resetSavedArtworkImageUrls: action((state) => {
    state.savedArtworkImageUrls = []
  }),
  setHasPendingCompletionAnimation: action((state, payload) => {
    state.hasPendingCompletionAnimation = payload
  }),
})
