import { Color } from "@artsy/palette-mobile"
import { action, Action, createContextStore } from "easy-peasy"

export interface InfiniteDiscoveryContextModel {
  artworks: Color[]
  currentArtwork: Color
  goToPreviousArtwork: Action<this>
  goToNextArtwork: Action<this>
}

export const initialModel: InfiniteDiscoveryContextModel = {
  artworks: ["red100", "green100", "blue100"],
  currentArtwork: "red100",
  goToPreviousArtwork: action((state) => {
    const currentIndex = state.artworks.indexOf(state.currentArtwork)
    if (currentIndex - 1 < 0) return
    const previousIndex = currentIndex - 1
    state.currentArtwork = state.artworks[previousIndex]
  }),
  goToNextArtwork: action((state) => {
    const currentIndex = state.artworks.indexOf(state.currentArtwork)
    if (currentIndex + 1 === state.artworks.length) return
    const nextIndex = currentIndex + 1
    state.currentArtwork = state.artworks[nextIndex]
  }),
}

export const InfiniteDiscoveryContext = createContextStore((runtimeModel) => {
  return {
    ...initialModel,
    ...runtimeModel,
  }
})
