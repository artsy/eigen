import { action, Action } from "easy-peasy"
import { LayoutAnimation } from "react-native"
import { VisualClueName, visualClueNames } from "./config/visualClues"

export interface VisualClueModel {
  sessionState: {
    nextId: number
    clues: Array<Omit<string, "positionIndex">>
  }
  addClue: Action<this, VisualClueName | string>
  seenVisualClues: Array<VisualClueName | string>
  setVisualClueAsSeen: Action<this, VisualClueName | string>
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
  seenVisualClues: [],
  setVisualClueAsSeen: action((state, clueName) => {
    const isSessionClue = !visualClueNames.includes(clueName)

    if (isSessionClue) {
      state.sessionState.clues = state.sessionState.clues.filter((clue) => clue !== clueName)
    } else {
      if (state.seenVisualClues.includes(clueName)) {
        return
      }

      LayoutAnimation.configureNext({
        ...LayoutAnimation.Presets.easeInEaseOut,
        duration: 500,
      })

      state.seenVisualClues = [...state.seenVisualClues, clueName]
    }
  }),
})
