import { IVariant, useVariant } from "@unleash/proxy-client-react"
import { GlobalStore } from "app/store/GlobalStore"
import { EXPERIMENT_NAME } from "app/utils/experiments/experiments"
import { ContextProps, reportExperimentVariant } from "app/utils/experiments/reporter"

export function useExperimentVariant(name: EXPERIMENT_NAME): {
  enabled: boolean
  variant: string
  payload?: string
  unleashVariant: string
  unleashPayload?: string
  trackExperiment: (contextProps?: ContextProps) => void
} {
  const localPayloadOverrides = GlobalStore.useAppState(
    (s) => s.artsyPrefs.experiments.localPayloadOverrides
  )
  const localVariantOverrides = GlobalStore.useAppState(
    (s) => s.artsyPrefs.experiments.localVariantOverrides
  )

  const variant = useVariant(name) as IVariant

  const trackExperiment = (contextProps?: ContextProps) => {
    if (!variant.enabled || localVariantOverrides[name]) {
      return
    }

    reportExperimentVariant({
      experimentName: name,
      variantName: variant.name,
      ...(contextProps as ContextProps),
    })
  }

  return {
    enabled: variant.enabled,
    variant: localVariantOverrides[name] || variant.name,
    payload: localPayloadOverrides[name] || variant.payload?.value,
    unleashVariant: variant.name,
    unleashPayload: variant.payload?.value,
    trackExperiment,
  }
}
