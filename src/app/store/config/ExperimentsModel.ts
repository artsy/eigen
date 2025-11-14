import { assignDeep } from "app/store/persistence"
import { EXPERIMENT_NAME } from "app/system/flags/experiments"
import { action, Action } from "easy-peasy"
import { IVariant } from "unleash-proxy-client"

export interface ExperimentsModel {
  sessionState: {
    isReady: boolean
    lastUpdate: string | null
  }
  unleashVariants: { [k in EXPERIMENT_NAME]?: IVariant }
  localVariantOverrides: { [k in EXPERIMENT_NAME]?: string }
  localPayloadOverrides: { [k in EXPERIMENT_NAME]?: string }

  setSessionState: Action<this, Partial<this["sessionState"]>>
  setUnleashVariants: Action<ExperimentsModel, { [k in EXPERIMENT_NAME]?: IVariant }>
  setLocalVariantOverride: Action<
    ExperimentsModel,
    { key: EXPERIMENT_NAME; value: string | undefined | null }
  >
  setLocalPayloadOverride: Action<
    ExperimentsModel,
    { key: EXPERIMENT_NAME; value: string | undefined | null }
  >
  resetOverrides: Action<ExperimentsModel>
}

export const getExperimentsModel = (): ExperimentsModel => ({
  sessionState: {
    isReady: false,
    lastUpdate: null,
  },
  unleashVariants: {},
  localVariantOverrides: {},
  localPayloadOverrides: {},

  setSessionState: action<ExperimentsModel, Partial<ExperimentsModel["sessionState"]>>(
    (state, payload) => {
      assignDeep(state, { sessionState: payload })
    }
  ),

  // Explicitly set Unleash variants; keep this separate from sessionState for clarity and typing.
  setUnleashVariants: action((state, payload) => {
    state.unleashVariants = payload || {}
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
  resetOverrides: action((state) => {
    state.localVariantOverrides = {}
    state.localPayloadOverrides = {}
  }),
})
