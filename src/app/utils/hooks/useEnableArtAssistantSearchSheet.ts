import { useEnableArtAssistant } from "app/utils/hooks/useEnableArtAssistant"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"

export function useEnableArtAssistantSearchSheet() {
  const isArtAssistantEnabled = useEnableArtAssistant()
  const isSheetReleased = useFeatureFlag("AREnableArtAssistantSearchSheet")

  return isArtAssistantEnabled && isSheetReleased
}
