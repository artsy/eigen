import { useDevToggle } from "app/utils/hooks/useDevToggle"
import { useIsStaging } from "app/utils/hooks/useIsStaging"

export function useUnleashEnvironment(): { unleashEnv: "staging" | "production" } {
  const isStaging = useIsStaging()
  const useProductionUnleash = useDevToggle("DTUseProductionUnleash")
  const unleashEnv = __DEV__
    ? useProductionUnleash
      ? "production"
      : "staging"
    : isStaging
      ? "staging"
      : "production"

  return { unleashEnv }
}
