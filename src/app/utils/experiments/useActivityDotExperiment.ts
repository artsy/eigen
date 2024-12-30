import { useExperimentVariant } from "app/utils/experiments/hooks"

type Variant = "control" | "variant-b" | "variant-c"
type Color = "red50" | "blue100"

export function useActivityDotExperiment() {
  const { enabled, trackExperiment, variant, payload } = useExperimentVariant(
    "onyx_activity-dot-experiment"
  )

  // Dev Menu helper to force visible dots for testing during QA
  const forceDots = Boolean(payload && JSON.parse(payload)?.forceDots === "true")

  const color: Color = enabled ? (variant === "variant-b" ? "red50" : "blue100") : "blue100"

  return {
    enabled,
    variant: variant as Variant,
    color,
    trackExperiment,
    forceDots,
  }
}
