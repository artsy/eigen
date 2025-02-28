import { Action, action } from "easy-peasy"

export interface InfiniteDiscoveryModel {
  savedArtworksCount: number
  incrementSavedArtworksCount: Action<this>
  decrementSavedArtworksCount: Action<this>
  resetSavedArtworksCount: Action<this>
}

export const getInfiniteDiscoveryModel = (): InfiniteDiscoveryModel => ({
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
})
