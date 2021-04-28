import analytics from "@segment/analytics-react-native"
import { Platform } from "react-native"
import Config from "react-native-config"
import { TrackingProvider } from "."

analytics
  .setup(Config.SEGMENT_STAGING_WRITE_KEY_ANDROID, {})
  .then(() => console.log("Analytics is ready"))
  .catch((err) => console.error("Something went wrong", err))

export const SegmentTrackingProvider: TrackingProvider = {
  identify: (userId, traits) => {
    if (Platform.OS !== "android") {
      return
    } // temporary guard

    analytics.identify(userId, traits)
  },

  postEvent: (info) => {
    if (Platform.OS !== "android") {
      return
    } // temporary guard

    if ("action" in info) {
      const { action } = info
      if (action === ActionType.screen) {
        const { context_screen } = info
      } else {
        analytics.track(action, info as any)
      }
      return
    }

    if ("action_type" in info) {
      const { action_type, ...rest } = info
      analytics.track(action_type, rest as any)
      return
    }

    if ("name" in info) {
      const { name, ...rest } = info
      analytics.track(name, rest as any)
      return
    }

    if ("context_screen" in info) {
      const { context_screen, ...rest } = info
      analytics.screen(context_screen, rest as any)
      return
    }

    console.warn("oh wow, we are not tracking this event!! we should!", { info })
    assertNever(info)
  },
}
