import { Action, action } from "easy-peasy"

export interface InfiniteDiscoveryModel {
  discoveredArtworkIds: string[]
  addDiscoveredArtworkId: Action<this, string>
}

export const getInfiniteDiscoveryModel = (): InfiniteDiscoveryModel => ({
  discoveredArtworkIds: [],
  addDiscoveredArtworkId: action((state, artworkId) => {
    if (!state.discoveredArtworkIds.includes(artworkId)) {
      state.discoveredArtworkIds.push(artworkId)
    }
  }),
})
