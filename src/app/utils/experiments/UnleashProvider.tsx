import { createContext, useCallback, useEffect, useState } from "react"
import useAppState from "../useAppState"
import { forceFetchToggles } from "./helpers"
import { useUnleashEnvironment } from "./hooks"
import { getUnleashClient } from "./unleashClient"

interface UnleashContext {
  lastUpdate: Date | null
}

export const UnleashContext = createContext<UnleashContext>({ lastUpdate: null })

export function UnleashProvider({ children }: { children?: React.ReactNode }) {
  const [lastUpdate, setLastUpdate] = useState<UnleashContext["lastUpdate"]>(null)
  const { unleashEnv } = useUnleashEnvironment()

  useEffect(() => {
    const client = getUnleashClient(unleashEnv)

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    client.on("initialized", () => {})

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    client.on("ready", () => {})

    client.on("update", () => {
      setLastUpdate(new Date())
    })

    client.on("error", () => {
      console.error("Unleash error")
    })

    // eslint-disable-next-line @typescript-eslint/no-empty-function
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
