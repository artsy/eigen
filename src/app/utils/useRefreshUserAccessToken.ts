import { GlobalStore } from "app/store/GlobalStore"
import { useEffect } from "react"

export function useRefreshUserAccessToken() {
  useEffect(() => {
    void GlobalStore.actions.auth.refreshUserAccessToken()
  }, [])
}
