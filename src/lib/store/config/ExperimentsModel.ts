import { action, Action } from "easy-peasy"
import { assignDeep } from "../persistence"

export interface ExperimentsModel {
  sessionState: {
    isReady: boolean
    lastUpdate: string | null
  }
  setSessionState: Action<this, Partial<this["sessionState"]>>
}

export const getExperimentsModel = (): ExperimentsModel => ({
  sessionState: {
    isReady: false,
    lastUpdate: null,
  },
  setSessionState: action((state, payload) => {
    assignDeep(state, { sessionState: payload })
  }),
})
