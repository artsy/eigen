import AsyncStorage from "@react-native-async-storage/async-storage"
import { useFeatureFlag } from "app/store/GlobalStore"
import { useDidMount } from "app/utils/hooks/useDidMount"
import { useStoreState } from "easy-peasy"
import { uniqBy } from "lodash"
import { createContext, FC, useCallback, useContext, useEffect, useState } from "react"
import * as Yup from "yup"

interface DismissedKey {
  key: ProgressiveOnboardingKey
  timestamp: number
}

interface DismissedKeyStatus {
  status: boolean
  timestamp: number
}

const ProgressiveOnboardingContext = createContext<{
  dismissed: DismissedKey[]
  dismiss: (key: ProgressiveOnboardingKey | ProgressiveOnboardingKey[]) => void
  isDismissed: (key: ProgressiveOnboardingKey) => DismissedKeyStatus
}>({
  dismissed: [],
  dismiss: () => {},
  isDismissed: (_key) => ({ status: false, timestamp: 0 }),
})

export const ProgressiveOnboardingProvider: FC = ({ children }) => {
  const id = useStoreState((state) => state.auth.userId) ?? "user"

  const [dismissed, setDismissed] = useState<DismissedKey[]>([])

  const dismiss = useCallback(
    (key: ProgressiveOnboardingKey | ProgressiveOnboardingKey[]) => {
      const keys = Array.isArray(key) ? key : [key]
      const timestamp = Date.now()

      __dismiss__(id, timestamp, keys)

      setDismissed((prevDismissed) =>
        uniqBy([...prevDismissed, ...keys.map((k) => ({ key: k, timestamp }))], (d) => d.key)
      )
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
      if (!mounted) return { status: false, timestamp: 0 }

      const dismissedKey = dismissed.find((d) => d.key === key)

      return dismissedKey
        ? { status: true, timestamp: dismissedKey.timestamp }
        : { status: false, timestamp: 0 }
    },
    [dismissed, mounted]
  )

  return (
    <ProgressiveOnboardingContext.Provider
      value={{
        dismissed,
        dismiss,
        isDismissed,
      }}
    >
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

const schema = Yup.object().shape({
  key: Yup.string().oneOf([...PROGRESSIVE_ONBOARDING_KEYS]),
  timestamp: Yup.number(),
})

const isValid = (value: any): value is DismissedKey => {
  return schema.isValidSync(value)
}

export const parse = (value: string | null): DismissedKey[] => {
  if (!value) return []

  try {
    const parsed = JSON.parse(value)

    return parsed.filter((obj: any) => {
      return isValid(obj) && PROGRESSIVE_ONBOARDING_KEYS.includes(obj.key)
    })
  } catch (err) {
    return []
  }
}

// TODO: Error handling for the 3 following methods
export const __dismiss__ = async (
  id: string,
  timestamp: number,
  key: ProgressiveOnboardingKey | ProgressiveOnboardingKey[]
) => {
  const keys = Array.isArray(key) ? key : [key]

  keys.forEach(async (key) => {
    const item = await AsyncStorage.getItem(localStorageKey(id))
    const dismissed = parse(item)

    await AsyncStorage.setItem(
      localStorageKey(id),
      JSON.stringify(uniqBy([...dismissed, { key, timestamp }], ({ key }) => key))
    )
  })
}

export const get = async (id: string) => {
  const item = await AsyncStorage.getItem(localStorageKey(id)).catch((e) => {
    console.log("Error fetching onboarding state from local storage", e)
    return JSON.stringify([{ status: false, timestamp: 0 }])
  })

  return parse(item)
}

export const reset = async (id: string) => {
  await AsyncStorage.removeItem(localStorageKey(id)).catch((e) =>
    console.log("Error writing reset to local storage", e)
  )
}
