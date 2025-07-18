import { Action, action } from "easy-peasy"

export interface InfiniteDiscoveryModel {
  hasSavedArtworks: boolean
  hasInteractedWithOnboarding: boolean
  savedArtworksCount: number
  sessionState: {
    moreInfoSheetVisible: boolean
  }
  incrementSavedArtworksCount: Action<this>
  decrementSavedArtworksCount: Action<this>
  resetSavedArtworksCount: Action<this>
  setHasInteractedWithOnboarding: Action<this, boolean>
  setHasSavedArtworks: Action<this, boolean>
  setMoreInfoSheetVisible: Action<this, boolean>
}

export const getInfiniteDiscoveryModel = (): InfiniteDiscoveryModel => ({
  hasSavedArtworks: false,
  hasInteractedWithOnboarding: false,
  savedArtworksCount: 0,
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
})
