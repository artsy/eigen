import AsyncStorage from "@react-native-async-storage/async-storage"
import { useFeatureFlag } from "app/store/GlobalStore"
import { useDidMount } from "app/utils/useDidMount"
import { useStoreState } from "easy-peasy"
import { uniq } from "lodash"
import { createContext, FC, useCallback, useContext, useEffect, useState } from "react"

const ProgressiveOnboardingContext = createContext<{
  dismissed: ProgressiveOnboardingKey[]
  dismiss: (key: ProgressiveOnboardingKey) => void
  isDismissed: (key: ProgressiveOnboardingKey) => boolean
}>({
  dismissed: [],
  dismiss: () => {},
  isDismissed: () => false,
})

export const ProgressiveOnboardingProvider: FC = ({ children }) => {
  const id = useStoreState((state) => state.auth.userId) ?? "user"

  const [dismissed, setDismissed] = useState<ProgressiveOnboardingKey[]>([])

  const dismiss = useCallback(
    (key: ProgressiveOnboardingKey) => {
      __dismiss__(id, key)
      setDismissed((prevDismissed) => [...prevDismissed, key])
    },
    [id]
  )

  useEffect(() => {
    const handleDismiss = async () => {
      setDismissed(await get(id))
    }

    handleDismiss()
  }, [id])

  const mounted = useDidMount()

  const isDismissed = useCallback(
    (key: ProgressiveOnboardingKey) => {
      return !mounted || dismissed.includes(key)
    },
    [dismissed, mounted]
  )

  return (
    <ProgressiveOnboardingContext.Provider value={{ dismissed, dismiss, isDismissed }}>
      {children}
    </ProgressiveOnboardingContext.Provider>
  )
}

type Kind = "follows" | "saves" | "alerts"

export const useProgressiveOnboarding = () => {
  const { dismiss, dismissed, isDismissed } = useContext(ProgressiveOnboardingContext)

  const followEnabled = useFeatureFlag("AREnableProgressiveOnboardingFollows")
  const saveEnabled = useFeatureFlag("AREnableProgressiveOnboardingSaves")
  const alertEnabled = useFeatureFlag("AREnableProgressiveOnboardingAlerts")

  const isEnabledFor = (kind: Kind) => {
    switch (kind) {
      case "follows":
        return followEnabled
      case "saves":
        return saveEnabled
      case "alerts":
        return alertEnabled
    }
  }

  return {
    dismiss,
    dismissed,
    isEnabledFor,
    isDismissed,
  }
}

export const localStorageKey = (id: string) => {
  return `progressive-onboarding.dismissed.${id}`
}

// Follows
export const PROGRESSIVE_ONBOARDING_FOLLOW_ARTIST = "follow-artist"
export const PROGRESSIVE_ONBOARDING_FOLLOW_FIND = "follow-find"
export const PROGRESSIVE_ONBOARDING_FOLLOW_HIGHLIGHT = "follow-highlight"
// Saves
export const PROGRESSIVE_ONBOARDING_SAVE_ARTWORK = "save-artwork"
export const PROGRESSIVE_ONBOARDING_SAVE_FIND = "save-find"
export const PROGRESSIVE_ONBOARDING_SAVE_HIGHLIGHT = "save-highlight"
// Alerts
export const PROGRESSIVE_ONBOARDING_ALERT_CREATE = "alert-create"
export const PROGRESSIVE_ONBOARDING_ALERT_SELECT_FILTER = "alert-select-filter"
export const PROGRESSIVE_ONBOARDING_ALERT_READY = "alert-ready"
export const PROGRESSIVE_ONBOARDING_ALERT_FIND = "alert-find"

export const PROGRESSIVE_ONBOARDING_KEYS = [
  PROGRESSIVE_ONBOARDING_FOLLOW_ARTIST,
  PROGRESSIVE_ONBOARDING_FOLLOW_FIND,
  PROGRESSIVE_ONBOARDING_FOLLOW_HIGHLIGHT,
  PROGRESSIVE_ONBOARDING_SAVE_ARTWORK,
  PROGRESSIVE_ONBOARDING_SAVE_FIND,
  PROGRESSIVE_ONBOARDING_SAVE_HIGHLIGHT,
  PROGRESSIVE_ONBOARDING_ALERT_CREATE,
  PROGRESSIVE_ONBOARDING_ALERT_SELECT_FILTER,
  PROGRESSIVE_ONBOARDING_ALERT_READY,
  PROGRESSIVE_ONBOARDING_ALERT_FIND,
] as const

export type ProgressiveOnboardingKey = typeof PROGRESSIVE_ONBOARDING_KEYS[number]

export const parse = (_id: string, value: string | null): ProgressiveOnboardingKey[] => {
  if (!value) return []

  try {
    const parsed = JSON.parse(value)

    return parsed.filter((key: any) => {
      return PROGRESSIVE_ONBOARDING_KEYS.includes(key)
    })
  } catch (err) {
    return []
  }
}

// TODO: Error handling for the 3 following methods
export const __dismiss__ = async (id: string, key: ProgressiveOnboardingKey) => {
  const item = await AsyncStorage.getItem(localStorageKey(id))
  const dismissed = parse(id, item)

  await AsyncStorage.setItem(localStorageKey(id), JSON.stringify(uniq([...dismissed, key])))
}

export const get = async (id: string) => {
  const item = await AsyncStorage.getItem(localStorageKey(id))

  return parse(id, item)
}

export const reset = async (id: string) => {
  await AsyncStorage.removeItem(localStorageKey(id))
}
