import { GlobalStore } from "app/store/GlobalStore"
import { useSystemIsDoneBooting } from "app/system/useSystemIsDoneBooting"
import { useEffect } from "react"

/**
 * This hook is used to update and notify any and all services that need a user id.
 * Once the user logs in or logs out, we will have their user id, and that will update all services.
 */
export function useIdentifyUser() {
  const isBooted = useSystemIsDoneBooting()

  const userId = GlobalStore.useAppState((store) => store.auth.userID)

  useEffect(() => {
    // If the user id changed (after log in or log out for example), we will update all services.
    if (isBooted) {
      GlobalStore.actions.auth.identifyUser()
    }
  }, [isBooted, userId])
}
