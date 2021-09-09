import { GlobalStore, useFeatureFlag } from "lib/store/GlobalStore"
import { useEffect, useState } from "react"
import { Platform } from "react-native"
import { createInsightsClient } from "search-insights"
import { RequestFnType } from "search-insights/dist/utils/request"

// Сustom implementation of the event sending function
// Otherwise events on android will not be tracked
const requestFn: RequestFnType = async (url, data) => {
  try {
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
  } catch (error) {
    console.error(error)
  }
}

export const searchInsights = createInsightsClient(requestFn)

export const useSearchInsightsConfig = (appId?: string, apiKey?: string) => {
  const [configured, setConfigured] = useState(false)
  const showNewOnboarding = useFeatureFlag("AREnableNewOnboardingFlow")
  const userIDFromStore = GlobalStore.useAppState((store) =>
    Platform.OS === "ios" && !showNewOnboarding ? store.native.sessionState.userID : store.auth.userID
  )
  const userID = userIDFromStore ?? "none"

  useEffect(() => {
    if (appId && apiKey) {
      searchInsights("init", {
        appId,
        apiKey,
        userToken: userID,
      })

      setConfigured(true)
    }
  }, [appId, apiKey, userID])

  return configured
}
