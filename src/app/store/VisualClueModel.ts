import { action, Action } from "easy-peasy"
import { VisualClueName } from "./config/visualClues"

export interface VisualClueModel {
  sessionState: {
    nextId: number
    clues: Array<Omit<string, "positionIndex">>
  }
  addClue: Action<this, VisualClueName>
  removeClue: Action<this, VisualClueName>
  seenVisualClues: VisualClueName[]
  setVisualClueAsSeen: Action<this, VisualClueName>
}

export const getVisualClueModel = (): VisualClueModel => ({
  sessionState: {
    nextId: 0,
    clues: [],
  },
  addClue: action((state, clueName) => {
    state.sessionState.clues.push(clueName)
    state.sessionState.nextId += 1
    return
  }),
  removeClue: action((state, clueName) => {
    state.sessionState.clues = state.sessionState.clues.filter((clue) => clue !== clueName)
  }),

  seenVisualClues: [],
  setVisualClueAsSeen: action((state, clueName) => {
    if (state.seenVisualClues.includes(clueName)) {
      return
    }

    state.seenVisualClues = [...state.seenVisualClues, clueName]
  }),
})
