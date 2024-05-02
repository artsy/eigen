import { GlobalStore } from "app/store/GlobalStore"
import { EXPERIMENT_NAME } from "app/utils/experiments/experiments"
import { ContextProps, reportExperimentVariant } from "app/utils/experiments/reporter"
import { useDevToggle } from "app/utils/hooks/useDevToggle"
import { useIsStaging } from "app/utils/hooks/useIsStaging"
import { useContext, useEffect, useState } from "react"
import { UnleashContext } from "./UnleashProvider"
import { getUnleashClient } from "./unleashClient"

export const __unsafe__getExperimentFlag = (name: EXPERIMENT_NAME): boolean | undefined => {
  const client = getUnleashClient()
  return client?.isEnabled(name)
}

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
  unleashVariant: string
  unleashPayload?: string
  trackExperiment: (contextProps?: ContextProps) => void
} {
  const client = getUnleashClient()
  const [enabled, setEnabled] = useState(client.isEnabled(name))
  const [variant, setVariant] = useState(client.getVariant(name))
  const localPayloadOverrides = GlobalStore.useAppState(
    (s) => s.artsyPrefs.experiments.localPayloadOverrides
  )
  const localVariantOverrides = GlobalStore.useAppState(
    (s) => s.artsyPrefs.experiments.localVariantOverrides
  )

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

  const unleashVariant = variant?.name ?? "default-variant"
  const unleashPayload = variant?.payload?.value

  return {
    enabled: enabled ?? false,
    variant: localVariantOverrides[name] || unleashVariant,
    payload: localPayloadOverrides[name] || unleashPayload,
    unleashVariant,
    unleashPayload,
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
