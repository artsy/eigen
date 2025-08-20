import { useUnleashClient } from "@unleash/proxy-client-react"
import { GlobalStore } from "app/store/GlobalStore"
import { jwtDecode } from "jwt-decode"
import { useEffect } from "react"

export const useUnleashInitializer = () => {
  const client = useUnleashClient()
  const userID = GlobalStore.useAppState((state) => state.auth.userID)
  const userAccessToken = GlobalStore.useAppState((state) => state.auth.userAccessToken)

  useEffect(() => {
    if (userID) {
      if (client.getContext().userId !== userID) {
        client.setContextField("userId", userID)

        if (userAccessToken) {
          const decodedToken = jwtDecode(userAccessToken) as { roles: string }

          const userRoles = decodedToken["roles"] ?? ""
          client.setContextField("userRoles", userRoles)
        }
      }

      client.start()
    } else {
      client.stop()
    }

    return () => {
      client.stop()
    }
  }, [userID, userAccessToken])
}
