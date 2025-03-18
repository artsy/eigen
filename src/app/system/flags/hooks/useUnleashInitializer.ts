import { useUnleashClient } from "@unleash/proxy-client-react"
import { GlobalStore } from "app/store/GlobalStore"
import { useEffect } from "react"

export const useUnleashInitializer = () => {
  const client = useUnleashClient()
  const userID = GlobalStore.useAppState((state) => state.auth.userID)

  useEffect(() => {
    if (userID) {
      if (client.getContext().userId !== userID) {
        client.setContextField("userId", userID)
      }

      client.start()
    } else {
      client.stop()
    }

    return () => {
      client.stop()
    }
  }, [userID])
}
