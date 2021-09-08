import { GlobalStore, useFeatureFlag } from "lib/store/GlobalStore"
import { useMemo } from "react"
import { Platform } from "react-native"
import searchInsights from "search-insights"

export const useSearchInsightsConfig = (appId: string, apiKey: string) => {
  const showNewOnboarding = useFeatureFlag("AREnableNewOnboardingFlow")
  const userIDFromStore = GlobalStore.useAppState((store) =>
    Platform.OS === "ios" && !showNewOnboarding ? store.native.sessionState.userID : store.auth.userID
  )
  const userID = userIDFromStore ?? "none"

  return useMemo(() => {
    if (appId && apiKey) {
      searchInsights("init", {
        appId,
        apiKey,
        userToken: userID,
      })

      return true
    }

    return false
  }, [appId, apiKey, userID])
}
