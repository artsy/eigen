import { GlobalStore, useFeatureFlag } from "lib/store/GlobalStore"
import { useEffect, useState } from "react"
import { Platform } from "react-native"
import searchInsights from "search-insights"

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
