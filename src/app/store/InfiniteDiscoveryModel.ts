import { Action, action } from "easy-peasy"

export interface InfiniteDiscoveryModel {
  hasInteractedWithOnboarding: boolean
  savedArtworksCount: number
  incrementSavedArtworksCount: Action<this>
  decrementSavedArtworksCount: Action<this>
  resetSavedArtworksCount: Action<this>
  setHasInteractedWithOnboarding: Action<this, boolean>
}

export const getInfiniteDiscoveryModel = (): InfiniteDiscoveryModel => ({
  hasInteractedWithOnboarding: false,
  savedArtworksCount: 0,
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
})
