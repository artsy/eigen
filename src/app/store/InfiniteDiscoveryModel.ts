export interface InfiniteDiscoveryModel {
  discoveredArtworkIds: string[]
}

export const getInfiniteDiscoveryModel = (): InfiniteDiscoveryModel => ({
  discoveredArtworkIds: [],
})
