import { useFeatureFlag } from "app/store/GlobalStore"
import { Platform } from "react-native"

export const useSearchDiscoveryContentEnabled = () => {
  if (Platform.OS === "ios") {
    return useFeatureFlag("AREnableSearchDiscoveryContentIOS")
  }

  return useFeatureFlag("AREnableSearchDiscoveryContentAndroid")
}
