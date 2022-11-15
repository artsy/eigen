import { useDevToggle, useIsStaging } from "app/store/GlobalStore"
import { useContext, useEffect, useState } from "react"
import { getUnleashClient } from "./unleashClient"
import { UnleashContext } from "./UnleashProvider"

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
    enabled,
    variant: variant.name,
    payload: variant.payload?.value,
  }
}

export function useUnleashEnvironment(): { unleashEnv: "staging" | "production" } {
  const isStaging = useIsStaging()

  const unleashEnv = __DEV__
    ? useDevToggle("DTUseProductionUnleash")
      ? "production"
      : "staging"
    : isStaging
    ? "staging"
    : "production"

  return { unleashEnv }
}
