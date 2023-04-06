import * as Sentry from "@sentry/react-native"
import { GlobalStore } from "app/store/GlobalStore"
import { useEffect } from "react"
import ReactAppboy from "react-native-appboy-sdk"
import SiftReactNative from "sift-react-native"
import { updateExperimentsContext } from "./experiments/helpers"
import { nullToUndef } from "./nullAndUndef"
import { SegmentTrackingProvider } from "./track/SegmentTrackingProvider"

/**
 * This hook is used to update and notify any and all services that need a user id.
 * Once the user logs in or logs out, we will have their user id, and that will update all services.
 */
export function useIdentifyUser() {
  const userId = GlobalStore.useAppState((store) => store.auth.userID)

  useEffect(() => {
    if (userId) {
      Sentry.setUser({ id: userId })
      ReactAppboy.changeUser(userId)
      SiftReactNative.setUserId(userId)
      // This is here becuase Sift's RN wrapper does not currently automatically collect or
      // upload events for Android devices. If they update the package, we can remove it.
      SiftReactNative.upload()
    }
    SegmentTrackingProvider.identify?.(userId, { is_temporary_user: userId === null ? 1 : 0 })

    updateExperimentsContext({ userId: nullToUndef(userId) })
  }, [userId])
}
