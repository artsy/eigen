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
})

// Saves
// displayed on Artwork grids
export const PROGRESSIVE_ONBOARDING_SAVE_ARTWORK = "save-artwork"

// Alerts
// make sure "save-artwork" is dismissed before showing alert chain
export const PROGRESSIVE_ONBOARDING_ALERT_CREATE = "alert-create"
export const PROGRESSIVE_ONBOARDING_ALERT_SELECT_FILTERS = "alert-select-filters"
export const PROGRESSIVE_ONBOARDING_ALERT_FINISH = "alert-finish"
export const PROGRESSIVE_ONBOARDING_ALERT_CHAIN = [
  PROGRESSIVE_ONBOARDING_ALERT_CREATE,
  PROGRESSIVE_ONBOARDING_ALERT_SELECT_FILTERS,
  PROGRESSIVE_ONBOARDING_ALERT_FINISH,
] as const

// My Collection
// independant Popover, called on Mycollection Artworks grid
export const PROGRESSIVE_ONBOARDING_MY_COLLECTION_SELL_THIS_WORK = "my-collection-sell-this-work"

// Partner Offer
// independant Popover, called on Saves screen
export const PROGRESSIVE_ONBOARDING_SIGNAL_INTEREST = "signal-interest"
export const PROGRESSIVE_ONBOARDING_OFFER_SETTINGS = "offer-settings"

// Act Now Tasks
// make sure it soes not conflict with "save-artwork"
export const PROGRESSIVE_ONBOARDING_ACT_NOW_TASKS = "act-now-tasks"

export const PROGRESSIVE_ONBOARDING_KEYS = [
  PROGRESSIVE_ONBOARDING_MY_COLLECTION_SELL_THIS_WORK,
  PROGRESSIVE_ONBOARDING_SAVE_ARTWORK,
  PROGRESSIVE_ONBOARDING_ALERT_CREATE,
  PROGRESSIVE_ONBOARDING_ALERT_SELECT_FILTERS,
  PROGRESSIVE_ONBOARDING_ALERT_FINISH,
  PROGRESSIVE_ONBOARDING_SIGNAL_INTEREST,
  PROGRESSIVE_ONBOARDING_OFFER_SETTINGS,
  PROGRESSIVE_ONBOARDING_ACT_NOW_TASKS,
] as const

export type ProgressiveOnboardingKey = (typeof PROGRESSIVE_ONBOARDING_KEYS)[number]
