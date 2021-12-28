import { action, Action } from "easy-peasy"
import { VisualClueName, visualClues } from "./config/visualClues"

export interface VisualClueModel {
  lastSeenOrderNumber: number
  setVisualClueAsSeen: Action<this, VisualClueName>
}

export const getVisualClueModel = (): VisualClueModel => ({
  lastSeenOrderNumber: 0,
  setVisualClueAsSeen: action((state, clueName) => {
    state.lastSeenOrderNumber = visualClues[clueName].orderNumber
  }),
})
