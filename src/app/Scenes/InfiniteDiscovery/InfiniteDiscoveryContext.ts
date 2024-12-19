import { action, Action, createContextStore } from "easy-peasy"

export interface InfiniteDiscoveryContextModel {
  artworks: any[]
  currentArtworkIndex: number
  goToPreviousArtwork: Action<this>
  goToNextArtwork: Action<this>
  setArtworks: Action<this, any[]>
}

export const initialModel: InfiniteDiscoveryContextModel = {
  artworks: [],
  currentArtworkIndex: 0,
  goToPreviousArtwork: action((state) => {
    if (state.currentArtworkIndex > 0) {
      state.currentArtworkIndex--
    }
  }),
  goToNextArtwork: action((state) => {
    if (state.currentArtworkIndex < state.artworks.length - 1) {
      state.currentArtworkIndex++
    }
  }),
  setArtworks: action((state, artworks) => {
    state.artworks = artworks
  }),
}

export const InfiniteDiscoveryContext = createContextStore((runtimeModel) => {
  return {
    ...initialModel,
    ...runtimeModel,
  }
})
