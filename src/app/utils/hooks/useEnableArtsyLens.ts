import { useExperimentFlag } from "app/system/flags/hooks/useExperimentFlag"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"

export function useEnableArtsyLens() {
  const isReleased = useFeatureFlag("AREnableArtsyLens")
  const isRolledOut = useExperimentFlag("onyx_artsy-lens")

  return isReleased && isRolledOut
}
