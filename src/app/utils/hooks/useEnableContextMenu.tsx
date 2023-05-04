import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { Platform } from "react-native"

/**
 * Hook to check if we should show the context menu on long press
 * of artwork cards.
 *
 * ⚠ available on iOS only
 *
 * @returns {boolean} shouldShowContextMenu
 */
export function useEnableContextMenu() {
  const isIOS = Platform.OS === "ios"
  const enableContextMenu = useFeatureFlag("AREnableArtworkContextMenu")

  const shouldShowContextMenu = isIOS && enableContextMenu

  return shouldShowContextMenu
}
