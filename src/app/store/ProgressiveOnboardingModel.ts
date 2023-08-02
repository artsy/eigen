import { Action, Computed, action, computed } from "easy-peasy"
import { uniqBy } from "lodash"

interface DismissedKey {
  key: ProgressiveOnboardingKey
  timestamp: number
}

interface DismissedKeyStatus {
  status: boolean
  timestamp: number
}

export interface ProgressiveOnboardingModel {
  dismissed: DismissedKey[]
  dismiss: Action<this, ProgressiveOnboardingKey | readonly ProgressiveOnboardingKey[]>
  isDismissed: Computed<this, (key: ProgressiveOnboardingKey) => DismissedKeyStatus>
  __clearDissmissed: Action<this>
}

export const getProgressiveOnboardingModel = (): ProgressiveOnboardingModel => ({
  dismissed: [],
  dismiss: action((state, key) => {
    const keys = Array.isArray(key) ? key : [key]
    const timestamp = Date.now()

    state.dismissed = uniqBy(
      [...state.dismissed, ...keys.map((k) => ({ key: k, timestamp }))],
      (d) => d.key
    )
  }),
  isDismissed: computed(({ dismissed }) => {
    return (key) => {
      const dismissedKey = dismissed.find((d) => d.key === key)

      return dismissedKey
        ? { status: true, timestamp: dismissedKey.timestamp }
        : { status: false, timestamp: 0 }
    }
  }),
  __clearDissmissed: action((state) => {
    state.dismissed = []
  }),
})

// Saves
export const PROGRESSIVE_ONBOARDING_SAVE_ARTWORK = "save-artwork"
export const PROGRESSIVE_ONBOARDING_FIND_SAVED_ARTWORK = "find-saved-artwork"
export const PROGRESSIVE_ONBOARDING_SAVE_HIGHLIGHT = "save-highlight"
export const PROGRESSIVE_ONBOARDING_SAVE_CHAIN = [
  PROGRESSIVE_ONBOARDING_SAVE_ARTWORK,
  PROGRESSIVE_ONBOARDING_FIND_SAVED_ARTWORK,
  PROGRESSIVE_ONBOARDING_SAVE_HIGHLIGHT,
]

export const PROGRESSIVE_ONBOARDING_KEYS = [
  PROGRESSIVE_ONBOARDING_SAVE_ARTWORK,
  PROGRESSIVE_ONBOARDING_FIND_SAVED_ARTWORK,
  PROGRESSIVE_ONBOARDING_SAVE_HIGHLIGHT,
] as const

export type ProgressiveOnboardingKey = typeof PROGRESSIVE_ONBOARDING_KEYS[number]
