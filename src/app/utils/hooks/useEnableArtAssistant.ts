import { useExperimentFlag } from "app/system/flags/hooks/useExperimentFlag"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"

export function useEnableArtAssistant() {
  const isReleased = useFeatureFlag("AREnableArtAssistant")
  const isRolledOut = useExperimentFlag("onyx_art-assistant-app")

  return isReleased && isRolledOut
}
