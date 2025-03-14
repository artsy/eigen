import { useUnleashClient } from "@unleash/proxy-client-react"
import { GlobalStore } from "app/store/GlobalStore"
import { useUnleashListener } from "app/utils/useUnleashListener"
import { useEffect } from "react"

export const UnleashInitializer: React.FC = ({ children }) => {
  const client = useUnleashClient()
  const userID = GlobalStore.useAppState((state) => state.auth.userID)

  useUnleashListener()

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

  return <>{children}</>
}
