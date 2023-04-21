import { useDevToggle } from "app/utils/hooks/useDevToggle"
import { useIsStaging } from "app/utils/hooks/useIsStaging"
import { useContext, useEffect, useState } from "react"
import { UnleashContext } from "./UnleashProvider"
import { getUnleashClient } from "./unleashClient"

export function useExperimentFlag(name: string) {
  const client = getUnleashClient()
  const [enabled, setEnabled] = useState(client.isEnabled(name))

  const { lastUpdate } = useContext(UnleashContext)
  useEffect(() => {
    setEnabled(client.isEnabled(name))
  }, [lastUpdate])

  return enabled
}

export function useExperimentVariant(name: string): {
  enabled: boolean
  variant: string
  payload?: string
} {
  const client = getUnleashClient()
  const [enabled, setEnabled] = useState(client.isEnabled(name))
  const [variant, setVariant] = useState(client.getVariant(name))

  const { lastUpdate } = useContext(UnleashContext)
  useEffect(() => {
    setEnabled(client.isEnabled(name))
    setVariant(client.getVariant(name))
  }, [lastUpdate])

  return {
    enabled: enabled ?? false,
    variant: variant?.name ?? "default-variant",
    payload: variant?.payload?.value,
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
