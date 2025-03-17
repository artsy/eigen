import { useUnleashClient } from "@unleash/proxy-client-react"
import { useEffect } from "react"

export const useUnleashListener = () => {
  const client = useUnleashClient()

  const onInitialized = () => {
    if (__DEV__) {
      console.log("[unleash] initialized")
    }
  }

  const onReady = () => {
    if (__DEV__) {
      console.log("[unleash] ready")
    }
  }

  const onUpdate = () => {
    if (__DEV__) {
      console.log("[unleash] updated")
    }
  }

  const onError = (e: Error) => {
    console.error(`[unleash] error ${JSON.stringify(e)}`)
  }

  useEffect(() => {
    client.on("initialized", onInitialized)
    client.on("ready", onReady)
    client.on("update", onUpdate)
    client.on("error", onError)

    return () => {
      client.off("initialized", onInitialized)
      client.off("ready", onReady)
      client.off("update", onUpdate)
      client.off("error", onError)
    }
  }, [])
}
