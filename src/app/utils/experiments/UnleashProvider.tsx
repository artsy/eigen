import { useDevToggle } from "app/store/GlobalStore"
import React, { createContext, ReactNode, useCallback, useEffect, useState } from "react"
import useAppState from "../useAppState"
import { forceFetchToggles } from "./helpers"
import { getUnleashClient } from "./unleashClient"

interface UnleashContext {
  lastUpdate: Date | null
}

export const UnleashContext = createContext<UnleashContext>({ lastUpdate: null })

export function UnleashProvider({ children }: { children?: ReactNode }) {
  const [lastUpdate, setLastUpdate] = useState<UnleashContext["lastUpdate"]>(null)
  const unleashEnv = useDevToggle("DTUseProductionUnleash") || !__DEV__ ? "production" : "staging"

  useEffect(() => {
    const client = getUnleashClient(unleashEnv)

    // tslint:disable-next-line: no-empty
    client.on("initialized", () => {})

    // tslint:disable-next-line: no-empty
    client.on("ready", () => {})

    client.on("update", () => {
      setLastUpdate(new Date())
    })

    client.on("error", () => {
      console.error("Unleash error")
    })

    // tslint:disable-next-line: no-empty
    client.on("impression", () => {})

    return () => {
      client.stop()
    }
  }, [unleashEnv])

  const onForeground = useCallback(() => {
    forceFetchToggles(unleashEnv)
  }, [unleashEnv])
  useAppState({ onForeground })

  return <UnleashContext.Provider value={{ lastUpdate }}>{children}</UnleashContext.Provider>
}
