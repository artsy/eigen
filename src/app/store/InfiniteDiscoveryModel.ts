import { Action, action } from "easy-peasy"

export interface InfiniteDiscoveryModel {
  discoveredArtworkIds: string[]
  addDiscoveredArtworkIds: Action<this, string[]>
}

export const getInfiniteDiscoveryModel = (): InfiniteDiscoveryModel => ({
  discoveredArtworkIds: [],
  addDiscoveredArtworkIds: action((state, artworkIds) => {
    state.discoveredArtworkIds = state.discoveredArtworkIds.concat(artworkIds)
  }),
})
