import { Action, action } from "easy-peasy"

export interface InfiniteDiscoveryModel {
  discoveredArtworkIds: string[]
  savedArtworksCount: number
  addDisoveredArtworkId: Action<this, string>
  incrementSavedArtworksCount: Action<this>
  decrementSavedArtworksCount: Action<this>
  resetSavedArtworksCount: Action<this>
}

export const getInfiniteDiscoveryModel = (): InfiniteDiscoveryModel => ({
  discoveredArtworkIds: [],
  savedArtworksCount: 0,
  addDisoveredArtworkId: action((state, artworkId) => {
    if (!state.discoveredArtworkIds.includes(artworkId)) {
      state.discoveredArtworkIds.push(artworkId)
    }
  }),
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
