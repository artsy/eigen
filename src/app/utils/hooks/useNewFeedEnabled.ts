import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { Platform } from "react-native"

/**
 * Hook to check if we should enable the new single feed.
 *
 */
export function useNewFeedEnabled() {
  const isAndroid = Platform.OS === "android"
  const enableArtworkFeed = useFeatureFlag("AREnableArtworkFeed")

  const isNewFeedEnabled = isAndroid && enableArtworkFeed

  return {
    isNewFeedEnabled,
  }
}
