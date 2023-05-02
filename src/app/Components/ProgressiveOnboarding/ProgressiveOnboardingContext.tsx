import { assignDeep } from "app/store/persistence"
import { Action, State, action, createContextStore } from "easy-peasy"
import { uniqBy } from "lodash"

interface DismissedKey {
  key: ProgressiveOnboardingKey
  timestamp: number
}

interface ProgressiveOnboardingModel {
  dismiss: Action<
    this,
    { key: ProgressiveOnboardingKey | ProgressiveOnboardingKey[]; timestamp: number }
  >
  dismissed: DismissedKey[]
  reset: Action<this, { key: ProgressiveOnboardingKey }>
}

export type ProgressiveOnboardingState = State<ProgressiveOnboardingModel>

// Saves
export const PROGRESSIVE_ONBOARDING_SAVE_ARTWORK = "save-artwork"
export const PROGRESSIVE_ONBOARDING_SAVE_FIND = "save-find"
export const PROGRESSIVE_ONBOARDING_SAVE_HIGHLIGHT = "save-highlight"
export const PROGRESSIVE_ONBOARDING_SAVE_CHAIN = [
  PROGRESSIVE_ONBOARDING_SAVE_ARTWORK,
  PROGRESSIVE_ONBOARDING_SAVE_FIND,
  PROGRESSIVE_ONBOARDING_SAVE_HIGHLIGHT,
] as const

export const PROGRESSIVE_ONBOARDING_KEYS = [
  PROGRESSIVE_ONBOARDING_SAVE_ARTWORK,
  PROGRESSIVE_ONBOARDING_SAVE_FIND,
  PROGRESSIVE_ONBOARDING_SAVE_HIGHLIGHT,
] as const

export type ProgressiveOnboardingKey = typeof PROGRESSIVE_ONBOARDING_KEYS[number]

export const getProgressiveOnboardingModel = (): ProgressiveOnboardingModel => ({
  dismiss: action((state, payload) => {
    const keys = Array.isArray(payload.key) ? payload.key : [payload.key]

    keys.forEach((key) => {
      state.dismissed = uniqBy(
        [...state.dismissed, { key, timestamp: payload.timestamp }],
        ({ key }) => key
      )
    })
  }),
  dismissed: [],
  reset: action((state, payload) => {
    state.dismissed = state.dismissed.filter((item) => item.key !== payload.key)
  }),
})

export function createProgressiveOnboardingStore() {
  if (__TEST__) {
    ;(getProgressiveOnboardingModel() as any).__injectState = action((state, injectedState) => {
      assignDeep(state, injectedState)
    })
  }

  const store = createContextStore<ProgressiveOnboardingModel>(
    (initialData: ProgressiveOnboardingState) => ({
      ...getProgressiveOnboardingModel(),
      ...initialData,
    })
  )

  return store
}

export const ProgressiveOnboardingStore = createProgressiveOnboardingStore()

export const ProgressiveOnboardingStoreProvider = ProgressiveOnboardingStore.Provider
