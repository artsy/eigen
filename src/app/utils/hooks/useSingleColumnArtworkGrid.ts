import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { Platform } from "react-native"

/**
 * Hook to check if we should enable the new single feed.
 *
 */
export function useSingleColumnArtworkGrid() {
  const isAndroid = Platform.OS === "android"
  const enableArtworkFeed = useFeatureFlag("AREnableSingleColumnArtworkGrid")

  const enableSingleColumnArtworkGrid = isAndroid && enableArtworkFeed

  return {
    enableSingleColumnArtworkGrid,
  }
}
