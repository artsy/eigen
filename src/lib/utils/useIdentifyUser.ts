import * as Sentry from "@sentry/react-native"
import { GlobalStore } from "lib/store/GlobalStore"
import { useEffect } from "react"
import { SegmentTrackingProvider } from "./track/SegmentTrackingProvider"

export const useIdentifyUser = () => {
  const userId = GlobalStore.useAppState((store) => store.auth.userID)

  useEffect(() => {
    console.log("userId", userId)

    Sentry.setUser({ id: userId ?? "none" })
    SegmentTrackingProvider.identify?.(userId, { is_temporary_user: userId === null ? 1 : 0 })
  }, [userId])
}
