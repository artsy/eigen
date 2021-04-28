import analytics from "@segment/analytics-react-native"
import Config from "react-native-config"
import { TrackingProvider } from "."

analytics
  .setup(Config.SEGMENT_STAGING_WRITE_KEY_ANDROID, {})
  .then(() => console.log("Analytics is ready"))
  .catch((err) => console.error("Something went wrong", err))

export const SegmentTrackingProvider: TrackingProvider = {
  postEvent: (info) => {
    if ("context_screen" in info) {
      const { context_screen, ...rest } = info
      analytics.screen(context_screen, { ...rest })
    }
  },
}
