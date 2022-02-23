import { useEffect } from "react"
import { AccessibilityInfo } from "react-native"
import { AnalyticsConstants } from "./track/constants"
import { SegmentTrackingProvider } from "./track/SegmentTrackingProvider"

// the purpose of this hook is to track the screen reader status of the user's device
export const useScreenReaderTracking = () => {
  useEffect(() => {
    const getScreenReaderStatus = async () => {
      const isEnabled = await AccessibilityInfo.isScreenReaderEnabled()
      SegmentTrackingProvider.identify?.(null, {
        [AnalyticsConstants.ScreenReaderStatus.key]: (() => {
          return isEnabled
            ? AnalyticsConstants.ScreenReaderStatus.value.Enabled
            : AnalyticsConstants.ScreenReaderStatus.value.Disabled
        })(),
      })
    }
    getScreenReaderStatus()
  }, [])
}
