import { action, Action } from "easy-peasy"
import { VisualClueName } from "./config/visualClues"

export interface VisualClueModel {
  seenVisualClues: VisualClueName[]
  setVisualClueAsSeen: Action<this, VisualClueName>
}

export const getVisualClueModel = (): VisualClueModel => ({
  seenVisualClues: [],
  setVisualClueAsSeen: action((state, clueName) => {
    if (state.seenVisualClues.includes(clueName)) {
      return
    }

    state.seenVisualClues = [...state.seenVisualClues, clueName]
  }),
})
