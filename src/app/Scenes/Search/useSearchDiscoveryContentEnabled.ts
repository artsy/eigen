import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { Platform } from "react-native"

export const useSearchDiscoveryContentEnabled = () => {
  const isIOS = Platform.OS === "ios"

  return useFeatureFlag(
    isIOS ? "AREnableSearchDiscoveryContentIOS" : "AREnableSearchDiscoveryContentAndroid"
  )
}
