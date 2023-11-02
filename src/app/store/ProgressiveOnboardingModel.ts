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
  sessionState: {
    // Controls when the Progressive Onboarding Popovers are able to de displayed
    // Right now we dispatch it from the home screen once it has focus
    isReady: boolean
  }
  setIsReady: Action<this>
  __clearDissmissed: Action<this>
}

export const getProgressiveOnboardingModel = (): ProgressiveOnboardingModel => ({
  sessionState: {
    isReady: false,
  },
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
  setIsReady: action((state) => {
    if (!state.sessionState.isReady) {
      state.sessionState.isReady = true
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
