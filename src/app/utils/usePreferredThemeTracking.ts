import { useEffect } from "react"
import { useColorScheme } from "react-native"
import { SegmentTrackingProvider } from "./track/SegmentTrackingProvider"
import { AnalyticsConstants } from "./track/constants"

// the purpose of this hook is to track the preferred theme of a user
export const usePreferredThemeTracking = () => {
  const colorScheme = useColorScheme()
  useEffect(() => {
    SegmentTrackingProvider.identify?.(undefined, {
      [AnalyticsConstants.UserInterfaceStyle.key]: (() => {
        switch (colorScheme) {
          case "light":
            return AnalyticsConstants.UserInterfaceStyle.value.Light
          case "dark":
            return AnalyticsConstants.UserInterfaceStyle.value.Dark
        }
        return AnalyticsConstants.UserInterfaceStyle.value.Unspecified
      })(),
    })
  }, [])
}
