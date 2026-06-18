import { useExperimentFlag } from "app/system/flags/hooks/useExperimentFlag"
import { useExperimentVariant } from "app/system/flags/hooks/useExperimentVariant"

export const useEnableLiveHomeRecommendations = (): {
  enabled: boolean
} => {
  const { variant } = useExperimentVariant("onyx_artwork-recommendations-refresh-eigen")
  const enabledForGravity = useExperimentFlag("onyx_artwork-recommendations-gravity")

  const enabled = enabledForGravity && variant.enabled && variant.name === "variant"

  return {
    enabled,
  }
}
