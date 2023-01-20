import { assignDeep } from "app/store/persistence"
import { action, Action } from "easy-peasy"

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
