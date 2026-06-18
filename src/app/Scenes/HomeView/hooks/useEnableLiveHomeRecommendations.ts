import { useExperimentFlag } from "app/system/flags/hooks/useExperimentFlag"
import { useExperimentVariant } from "app/system/flags/hooks/useExperimentVariant"

// Treatment arm of the eigen experiment. Must match the variant name configured in Unleash.
const TREATMENT_VARIANT_NAME = "variant"

/**
 * Whether live home recommendations (forced refresh of the recommended artworks rail) should
 * run. Enabled only for the treatment arm of the eigen experiment and when Gravity is ready.
 */
export const useEnableLiveHomeRecommendations = (): {
  enabled: boolean
} => {
  const { variant } = useExperimentVariant("onyx_artwork-recommendations-refresh-eigen")
  const enabledForGravity = useExperimentFlag("onyx_artwork-recommendations-gravity")

  const enabled = enabledForGravity && variant.enabled && variant.name === TREATMENT_VARIANT_NAME

  return {
    enabled,
  }
}
