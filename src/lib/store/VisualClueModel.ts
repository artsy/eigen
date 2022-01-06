import { action, Action } from "easy-peasy"
import { VisualClueName } from "./config/visualClues"

export interface VisualClueModel {
  seenVisualClues: VisualClueName[]
  setVisualClueAsSeen: Action<this, VisualClueName>
}

export const getVisualClueModel = (): VisualClueModel => ({
  seenVisualClues: [],
  setVisualClueAsSeen: action((state, clueName) => {
    state.seenVisualClues = [...new Set([...state.seenVisualClues, clueName])]
  }),
})
