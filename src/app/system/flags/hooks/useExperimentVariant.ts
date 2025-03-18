import { IVariant, useVariant } from "@unleash/proxy-client-react"
import { GlobalStore } from "app/store/GlobalStore"
import { EXPERIMENT_NAME } from "app/system/flags/experiments"
import { ContextProps, reportExperimentVariant } from "app/system/flags/reporter"

export function useExperimentVariant(name: EXPERIMENT_NAME): {
  variant: IVariant
  trackExperiment: (contextProps?: ContextProps) => void
} {
  const variant = useVariant(name) as IVariant

  const localVariantOverrides = GlobalStore.useAppState(
    (s) => s.artsyPrefs.experiments.localVariantOverrides
  )
  const localPayloadOverrides = GlobalStore.useAppState(
    (s) => s.artsyPrefs.experiments.localPayloadOverrides
  )
  let overrideApplied = false

  if (localVariantOverrides[name]) {
    variant.name = localVariantOverrides[name]
    overrideApplied = true
  }

  if (localPayloadOverrides[name]) {
    variant.payload = {
      type: "string",
      value: localPayloadOverrides[name],
    }
    overrideApplied = true
  }

  const trackExperiment = (contextProps?: ContextProps) => {
    if (!variant.enabled || overrideApplied) {
      if (__DEV__) {
        console.warn(
          `[unleash] ignoring request to track experiment because the variant is disabled or overridden, flag=${name} variant=${variant.name}`
        )
      }
      return
    }

    reportExperimentVariant({
      experimentName: name,
      variantName: variant.name,
      ...(contextProps as ContextProps),
    })
  }

  return {
    variant,
    trackExperiment,
  }
}
