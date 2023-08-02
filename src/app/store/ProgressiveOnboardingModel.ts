import { GlobalStore } from "app/store/GlobalStore"
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
  dismissed: Record<string, DismissedKey[]>
  dismiss: Action<this, { key: ProgressiveOnboardingKey | readonly ProgressiveOnboardingKey[] }>
  isDismissed: Computed<this, (key: ProgressiveOnboardingKey) => DismissedKeyStatus>
}

export const getProgressiveOnboardingModel = (): ProgressiveOnboardingModel => ({
  dismissed: {},
  dismiss: action((state, { key }) => {
    const userId = GlobalStore.useAppState((state) => state.auth.userID)
    if (!userId) {
      return
    }

    const keys = Array.isArray(key) ? key : [key]
    const timestamp = Date.now()

    state.dismissed = {
      ...state.dismissed,
      [userId]: uniqBy(
        [...state.dismissed[userId], ...keys.map((k) => ({ key: k, timestamp }))],
        (d) => d.key
      ),
    }
  }),
  isDismissed: computed(({ dismissed }) => {
    return (key) => {
      const userId = GlobalStore.useAppState((state) => state.auth.userID)
      if (!userId || !dismissed[userId]) {
        return { status: false, timestamp: 0 }
      }

      const dismissedKey = dismissed[userId].find((d) => d.key === key)

      return dismissedKey
        ? { status: true, timestamp: dismissedKey.timestamp }
        : { status: false, timestamp: 0 }
    }
  }),
})

// Saves
export const PROGRESSIVE_ONBOARDING_SAVE_ARTWORK = "save-artwork"
export const PROGRESSIVE_ONBOARDING_SAVE_CHAIN = [PROGRESSIVE_ONBOARDING_SAVE_ARTWORK]

export const PROGRESSIVE_ONBOARDING_KEYS = [PROGRESSIVE_ONBOARDING_SAVE_ARTWORK] as const

export type ProgressiveOnboardingKey = typeof PROGRESSIVE_ONBOARDING_KEYS[number]
