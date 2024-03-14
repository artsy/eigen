import { assignDeep } from "app/store/persistence"
import { EXPERIMENT_NAME } from "app/utils/experiments/experiments"
import { action, Action } from "easy-peasy"

export interface ExperimentsModel {
  sessionState: {
    isReady: boolean
    lastUpdate: string | null
  }
  localVariantOverrides: { [k in EXPERIMENT_NAME]?: string }
  localPayloadOverrides: { [k in EXPERIMENT_NAME]?: string }

  setSessionState: Action<this, Partial<this["sessionState"]>>
  setLocalVariantOverride: Action<
    ExperimentsModel,
    { key: EXPERIMENT_NAME; value: string | undefined | null }
  >
  setLocalPayloadOverride: Action<
    ExperimentsModel,
    { key: EXPERIMENT_NAME; value: string | undefined | null }
  >
}

export const getExperimentsModel = (): ExperimentsModel => ({
  sessionState: {
    isReady: false,
    lastUpdate: null,
  },
  localVariantOverrides: {},
  localPayloadOverrides: {},

  setSessionState: action((state, payload) => {
    assignDeep(state, { sessionState: payload })
  }),
  setLocalVariantOverride: action((state, { key, value }) => {
    if (!value) {
      delete state.localVariantOverrides[key]
    } else {
      state.localVariantOverrides[key] = value
    }
  }),
  setLocalPayloadOverride: action((state, { key, value }) => {
    if (!value) {
      delete state.localPayloadOverrides[key]
    } else {
      state.localPayloadOverrides[key] = value
    }
  }),
})
