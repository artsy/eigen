import { useExperimentFlag } from "app/system/flags/hooks/useExperimentFlag"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"

/**
 * Live home recommendations (forced refresh of the recommended artworks rail +
 * analytics re-firing) are gated behind BOTH:
 * - `AREnableLiveHomeRecommendations` — the eigen feature flag controlling the frontend rollout, and
 * - `onyx_artwork-recommendations-gravity` — the Unleash flag signalling backend readiness.
 *
 * The behavior is only enabled when both are on.
 */
export const useEnableLiveHomeRecommendations = (): boolean => {
  const enabledByFeatureFlag = useFeatureFlag("AREnableLiveHomeRecommendations")
  const enabledByUnleash = useExperimentFlag("onyx_artwork-recommendations-gravity")

  return enabledByFeatureFlag && enabledByUnleash
}
