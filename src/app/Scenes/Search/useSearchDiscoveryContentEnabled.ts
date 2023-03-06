import { useFeatureFlag } from "app/store/GlobalStore"
import { Platform } from "react-native"

export const useSearchDiscoveryContentEnabled = () => {
  const isIOS = Platform.OS === "ios"

  return useFeatureFlag(
    isIOS ? "AREnableSearchDiscoveryContentIOS" : "AREnableSearchDiscoveryContentAndroid"
  )
}
