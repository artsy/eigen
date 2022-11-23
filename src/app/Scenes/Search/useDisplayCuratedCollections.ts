import { useFeatureFlag } from "app/store/GlobalStore"
import { Platform } from "react-native"

export const useDisplayCuratedCollections = () => {
  const isFeatureFlagEnabled = useFeatureFlag("ARIosSearchTabCuratedCollections")

  if (Platform.OS === "ios") {
    return isFeatureFlagEnabled
  }

  return true
}
