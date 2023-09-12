import { GlobalStore } from "app/store/GlobalStore"
import { VisualClueName, visualClueNames } from "app/store/config/visualClues"

export const useVisualClue = () => {
  const seenVisualClues = GlobalStore.useAppState((state) => state.visualClue.seenVisualClues)
  const sessionVisualClues = GlobalStore.useAppState((state) => state.visualClue.sessionState.clues)

  const showVisualClue = (clueName?: VisualClueName | string): boolean => {
    if (!clueName) {
      return false
    }

    if (visualClueNames.includes(clueName)) {
      return !seenVisualClues.includes(clueName)
    }
    return sessionVisualClues.includes(clueName)
  }

  return { seenVisualClues, showVisualClue }
}

/**
 * @deprecated use dismissed from ProgressiveOnboardingModel instead
 */
export const addClue = GlobalStore.actions.visualClue.addClue

/**
 * @deprecated use dismiss from ProgressiveOnboardingModel instead
 */
export const setVisualClueAsSeen = GlobalStore.actions.visualClue.setVisualClueAsSeen

export const _removeVisualClueAsSeen = GlobalStore.actions.visualClue._removeVisualClueAsSeen
