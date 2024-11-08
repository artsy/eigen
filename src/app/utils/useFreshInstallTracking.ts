import { getCurrentEmissionState } from "app/store/GlobalStore"
import { useEffect } from "react"
import { AnalyticsConstants } from "./track/constants"
import { postEventToProviders } from "./track/providers"

export const useFreshInstallTracking = () => {
  useEffect(() => {
    const launchCount = getCurrentEmissionState().launchCount
    if (launchCount > 1) {
      return
    }
    postEventToProviders({ name: AnalyticsConstants.FreshInstall })
  }, [])
}
