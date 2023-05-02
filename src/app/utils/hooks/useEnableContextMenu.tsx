import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { Platform } from "react-native"

/**
 * Hook to check if we should enable the new single feed.
 *
 */
export function useEnableContextMenu() {
  const isIOS = Platform.OS === "ios"
  const enableContextMenu = useFeatureFlag("AREnableContextMenu")

  const shouldShowContextMenu = isIOS && enableContextMenu

  return shouldShowContextMenu
}
