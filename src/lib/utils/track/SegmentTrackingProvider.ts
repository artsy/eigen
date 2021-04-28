import analytics from "@segment/analytics-react-native"
import Config from "react-native-config"
import { TrackingProvider } from "."

analytics
  .setup(Config.SEGMENT_STAGING_WRITE_KEY_ANDROID, {
  })
  .then(() => console.log("Analytics is ready"))
  .catch((err) => console.error("Something went wrong", err))

export const SegmentTrackingProvider: TrackingProvider = {
  postEvent: (info: any) => {
  },
}
