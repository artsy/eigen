import { action, Action } from "easy-peasy"
import { assignDeep } from "../persistence"

export interface ExperimentsModel {
  isReady: boolean
  setState: Action<ExperimentsModel, Partial<{ isReady: boolean }>>
}

export const getExperimentsModel = (): ExperimentsModel => ({
  isReady: false,
  setState: action((state, payload) => {
    assignDeep(state, payload)
  }),
})
