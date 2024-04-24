import { GlobalStore } from "app/store/GlobalStore"
import useAppState from "app/utils/useAppState"
import { createContext, useCallback, useEffect, useState } from "react"
import { forceFetchToggles } from "./helpers"
import { useUnleashEnvironment } from "./hooks"
import { getUnleashClient } from "./unleashClient"

interface UnleashContext {
  lastUpdate: Date | null
}

export const UnleashContext = createContext<UnleashContext>({ lastUpdate: null })

export function UnleashProvider({ children }: { children?: React.ReactNode }) {
  const [lastUpdate, setLastUpdate] = useState<UnleashContext["lastUpdate"]>(null)
  const isHydrated = GlobalStore.useAppState((state) => state.sessionState.isHydrated)
  const userId = GlobalStore.useAppState((store) => store?.auth?.userID)

  const { unleashEnv } = useUnleashEnvironment()

  useEffect(() => {
    if (isHydrated) {
      const client = getUnleashClient({ env: unleashEnv, userId })

      client.on("initialized", () => {
        if (__DEV__) {
          console.log("Unleash initialized")
        }
      })

      client.on("ready", () => {
        if (__DEV__) {
          console.log("Unleash ready")
        }
      })

      client.on("update", () => {
        if (__DEV__) {
          console.log("Unleash updated")
        }
        setLastUpdate(new Date())
      })

      client.on("error", () => {
        console.error("Unleash error")
      })

      client.on("impression", () => {})

      return () => {
        client.stop()
      }
    }
  }, [unleashEnv, isHydrated])

  const onForeground = useCallback(() => {
    forceFetchToggles(unleashEnv)
  }, [unleashEnv])
  useAppState({ onForeground })

  return <UnleashContext.Provider value={{ lastUpdate }}>{children}</UnleashContext.Provider>
}
