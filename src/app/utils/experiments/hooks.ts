import { EXPERIMENT_NAME } from "app/utils/experiments/experiments"
import { ContextProps, reportExperimentVariant } from "app/utils/experiments/reporter"
import { useDevToggle } from "app/utils/hooks/useDevToggle"
import { useIsStaging } from "app/utils/hooks/useIsStaging"
import { useContext, useEffect, useState } from "react"
import { UnleashContext } from "./UnleashProvider"
import { getUnleashClient } from "./unleashClient"

export function useExperimentFlag(name: EXPERIMENT_NAME) {
  const client = getUnleashClient()
  const [enabled, setEnabled] = useState(client.isEnabled(name))

  const { lastUpdate } = useContext(UnleashContext)
  useEffect(() => {
    setEnabled(client.isEnabled(name))
  }, [lastUpdate])

  return enabled
}

export function useExperimentVariant(name: EXPERIMENT_NAME): {
  enabled: boolean
  variant: string
  payload?: string
  trackExperiment: (contextProps?: ContextProps) => void
} {
  const client = getUnleashClient()
  const [enabled, setEnabled] = useState(client.isEnabled(name))
  const [variant, setVariant] = useState(client.getVariant(name))

  const { lastUpdate } = useContext(UnleashContext)
  useEffect(() => {
    setEnabled(client.isEnabled(name))
    setVariant(client.getVariant(name))
  }, [lastUpdate])

  const trackExperiment = (contextProps?: ContextProps) => {
    if (!enabled) {
      return
    }

    reportExperimentVariant({
      experimentName: name,
      variantName: variant?.name ?? "default-variant",
      payload: variant?.payload?.value,
      ...(contextProps as ContextProps),
    })
  }

  return {
    enabled: enabled ?? false,
    variant: variant?.name ?? "default-variant",
    payload: variant?.payload?.value,
    trackExperiment,
  }
}

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
