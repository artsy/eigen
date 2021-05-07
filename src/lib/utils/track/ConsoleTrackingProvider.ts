import analytics from "@segment/analytics-react-native"
import Config from "react-native-config"
import { TrackingProvider } from "./providers"

export const ConsoleTrackingProvider: TrackingProvider = {
  setup: () => {
    analytics
      .setup(Config.SEGMENT_STAGING_WRITE_KEY_ANDROID, {})
      // trackAppLifecycleEvents: true,
      .then(() => console.log("Analytics is ready"))
      .catch((err) => console.error("Something went wrong", err))
  },

  identify: (userId, traits) => {
    if (!__DEV__) {
      return
    }

    analytics.identify(userId, traits)
  },

  postEvent: (info) => {
    if (!__DEV__) {
      return
    }

    console.log("[Event tracked]", JSON.stringify(info, null, 2))
  },
}
