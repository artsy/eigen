import { getCurrentEmissionState } from "app/store/GlobalStore"
import { useEffect } from "react"
import { AnalyticsConstants } from "./track/constants"
import { postEventToProviders } from "./track/providers"

export const useFreshInstallTracking = () => {
  useEffect(() => {
    const launchCount = getCurrentEmissionState().launchCount
    console.warn("[debug]", { launchCount })
    if (launchCount > 1) {
      console.warn("[debug] Not a fresh install, skipping fresh install tracking")
      return
    }
    console.warn("[debug] fresh install")
    postEventToProviders({ name: AnalyticsConstants.FreshInstall })
  }, [])
}
