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
    // we use this to control which popover is active, we cannot have 2 popovers
    // active at the same time
    activePopover?: string
  }
  setIsReady: Action<this, boolean>
  setActivePopover: Action<this, string | undefined>
  __clearDissmissed: Action<this>
  reset: Action<this>
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
    state.sessionState = { isReady: state.sessionState.isReady }
  }),
  isDismissed: computed(({ dismissed }) => {
    return (key) => {
      const dismissedKey = dismissed.find((d) => d.key === key)

      return dismissedKey
        ? { status: true, timestamp: dismissedKey.timestamp }
        : { status: false, timestamp: 0 }
    }
  }),
  setIsReady: action((state, isReady) => {
    state.sessionState.isReady = isReady
  }),
  setActivePopover: action((state, id) => {
    state.sessionState.activePopover = id
  }),
  __clearDissmissed: action((state) => {
    state.dismissed = []
  }),
  reset: action((state) => {
    state.dismissed = []
    state.sessionState = { isReady: false }
  }),
})

// Saves
export const PROGRESSIVE_ONBOARDING_SAVE_ARTWORK = "save-artwork"

// Alerts
export const PROGRESSIVE_ONBOARDING_ALERT_CREATE = "alert-create"
export const PROGRESSIVE_ONBOARDING_ALERT_SELECT_FILTERS = "alert-select-filters"
export const PROGRESSIVE_ONBOARDING_ALERT_FINISH = "alert-finish"
export const PROGRESSIVE_ONBOARDING_ALERT_CHAIN = [
  PROGRESSIVE_ONBOARDING_ALERT_CREATE,
  PROGRESSIVE_ONBOARDING_ALERT_SELECT_FILTERS,
  PROGRESSIVE_ONBOARDING_ALERT_FINISH,
] as const

// Partner Offer
export const PROGRESSIVE_ONBOARDING_SIGNAL_INTEREST = "signal-interest"
export const PROGRESSIVE_ONBOARDING_OFFER_SETTINGS = "offer-settings"

// Act Now Tasks
export const PROGRESSIVE_ONBOARDING_ACT_NOW_TASKS = "act-now-tasks"

// Alerts Reminder
export const PROGRESSIVE_ONBOARDING_ALERT_REMINDER_1 = "alert-create-reminder-1"
export const PROGRESSIVE_ONBOARDING_ALERT_REMINDER_2 = "alert-create-reminder-2"

// Dark Mode Home View Toast
export const PROGRESSIVE_ONBOARDING_DARK_MODE = "dark-mode"

// Long-Press Artwork Context Menu
export const PROGRESSIVE_ONBOARDING_LONG_PRESS_ARTWORK_CONTEXT_MENU =
  "long-press-artwork-context-menu"

export const PROGRESSIVE_ONBOARDING_INFINITE_DISCOVERY_SAVE_REMINDER_1 =
  "infinite-discovery-save-reminder-1"
export const PROGRESSIVE_ONBOARDING_INFINITE_DISCOVERY_SAVE_REMINDER_2 =
  "infinite-discovery-save-reminder-2"

export const PROGRESSIVE_ONBOARDING_PRICE_RANGE_POPOVER_HOME = "price-range-popover-home"

export const PROGRESSIVE_ONBOARDING_KEYS = [
  PROGRESSIVE_ONBOARDING_SAVE_ARTWORK,
  PROGRESSIVE_ONBOARDING_ALERT_CREATE,
  PROGRESSIVE_ONBOARDING_ALERT_SELECT_FILTERS,
  PROGRESSIVE_ONBOARDING_ALERT_FINISH,
  PROGRESSIVE_ONBOARDING_SIGNAL_INTEREST,
  PROGRESSIVE_ONBOARDING_OFFER_SETTINGS,
  PROGRESSIVE_ONBOARDING_ACT_NOW_TASKS,
  PROGRESSIVE_ONBOARDING_ALERT_REMINDER_1,
  PROGRESSIVE_ONBOARDING_ALERT_REMINDER_2,
  PROGRESSIVE_ONBOARDING_LONG_PRESS_ARTWORK_CONTEXT_MENU,
  PROGRESSIVE_ONBOARDING_INFINITE_DISCOVERY_SAVE_REMINDER_1,
  PROGRESSIVE_ONBOARDING_INFINITE_DISCOVERY_SAVE_REMINDER_2,
  PROGRESSIVE_ONBOARDING_DARK_MODE,
  PROGRESSIVE_ONBOARDING_PRICE_RANGE_POPOVER_HOME,
] as const

export type ProgressiveOnboardingKey = (typeof PROGRESSIVE_ONBOARDING_KEYS)[number]
