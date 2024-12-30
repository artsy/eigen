import { useExperimentVariant } from "app/utils/experiments/hooks"

export function useActivityDotExperiment() {
  const { enabled, trackExperiment, variant, payload } = useExperimentVariant(
    "onyx_activity-dot-experiment"
  )

  // Dev Menu QA helper to force visible dots for testing
  const forceDots = Boolean(payload && JSON.parse(payload)?.forceDots === "true")

  return { enabled, variant, trackExperiment, forceDots }
}
