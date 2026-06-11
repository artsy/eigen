import { useExperimentFlag } from "app/system/flags/hooks/useExperimentFlag"

/**
 * Live home recommendations (forced refresh of the recommended artworks rail +
 * analytics re-firing) are gated behind BOTH Unleash flags:
 * - `onyx_artwork-recommendations-refresh-eigen` — the eigen frontend rollout, and
 * - `onyx_artwork-recommendations-gravity` — backend readiness.
 *
 * The behavior is only enabled when both are on.
 */
export const useEnableLiveHomeRecommendations = (): boolean => {
  const enabledForEigen = useExperimentFlag("onyx_artwork-recommendations-refresh-eigen")
  const enabledForGravity = useExperimentFlag("onyx_artwork-recommendations-gravity")

  return enabledForEigen && enabledForGravity
}
