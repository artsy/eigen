import { Color } from "@artsy/palette-mobile"
import { action, Action, createContextStore } from "easy-peasy"

export interface InfiniteDiscoveryContextModel {
  artworkIds: Color[]
  currentArtworkId: Color
  goBack: Action<this>
  goForward: Action<this>
}

export const initialModel: InfiniteDiscoveryContextModel = {
  artworkIds: [
    "black100",
    "white100",
    "green100",
    "yellow100",
    "orange100",
    "red100",
    "purple100",
    "blue100",
  ],
  currentArtworkId: "black100",
  goBack: action((state) => {
    const currentIndex = state.artworkIds.indexOf(state.currentArtworkId)
    if (currentIndex - 1 < 0) return
    const previousIndex = currentIndex - 1
    state.currentArtworkId = state.artworkIds[previousIndex]
  }),
  goForward: action((state) => {
    const currentIndex = state.artworkIds.indexOf(state.currentArtworkId)
    if (currentIndex + 1 === state.artworkIds.length) return
    const nextIndex = currentIndex + 1
    state.currentArtworkId = state.artworkIds[nextIndex]
  }),
}

export const InfiniteDiscoveryContext = createContextStore((runtimeModel) => {
  return {
    ...initialModel,
    ...runtimeModel,
  }
})
