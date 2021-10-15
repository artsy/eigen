import { action, Action } from "easy-peasy"
import { assignDeep } from "../persistence"

export interface ExperimentsModel {
  isReady: boolean
  client: SplitIO.IClient | undefined
  setState: Action<ExperimentsModel, Partial<{ isReady: boolean; client: SplitIO.IClient | undefined }>>
}

export const getExperimentsModel = (): ExperimentsModel => ({
  isReady: false,
  client: undefined,
  setState: action((state, payload) => {
    assignDeep(state, payload)
  }),
})
