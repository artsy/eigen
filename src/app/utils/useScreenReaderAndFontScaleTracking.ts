import { useEffect } from "react"
import { AccessibilityInfo } from "react-native"
import DeviceInfo from "react-native-device-info"
import { SegmentTrackingProvider } from "./track/SegmentTrackingProvider"
import { AnalyticsConstants } from "./track/constants"

// the purpose of this hook is to track the screen reader status of the user's device
export const useScreenReaderAndFontScaleTracking = () => {
  useEffect(() => {
    const getScreenReaderStatus = async () => {
      const isEnabled = await AccessibilityInfo.isScreenReaderEnabled()
      SegmentTrackingProvider.identify?.(undefined, {
        [AnalyticsConstants.ScreenReaderStatus.key]: (() => {
          return isEnabled
            ? AnalyticsConstants.ScreenReaderStatus.value.Enabled
            : AnalyticsConstants.ScreenReaderStatus.value.Disabled
        })(),
      })
    }

    const getFontScale = async () => {
      try {
        const fontScale = await DeviceInfo.getFontScale()

        SegmentTrackingProvider.identify?.(undefined, {
          fontScale: fontScale,
        })

        return fontScale
      } catch (error) {
        console.error("Error getting font scale: ", error)
      }
      return
    }

    getFontScale()
    getScreenReaderStatus()
  }, [])
}
