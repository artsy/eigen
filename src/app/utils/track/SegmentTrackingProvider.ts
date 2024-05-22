import { Analytics } from "@segment/analytics-react-native"
import { addBreadcrumb } from "@sentry/react-native"
import { visualize } from "app/utils/visualizer"
import { Platform } from "react-native"
import Config from "react-native-config"
import { isCohesionScreen, TrackingProvider } from "./providers"

export const SEGMENT_TRACKING_PROVIDER = "SEGMENT_TRACKING_PROVIDER"

const visualizeDevToggle = "DTShowAnalyticsVisualiser"

let analytics: Analytics.Client
export const SegmentTrackingProvider: TrackingProvider = {
  setup: () => {
    analytics = require("@segment/analytics-react-native").default
    const Braze = require("@segment/analytics-react-native-plugin-braze").default

    analytics
      .setup(
        Platform.select({
          ios: __DEV__
            ? Config.SEGMENT_STAGING_WRITE_KEY_IOS
            : Config.SEGMENT_PRODUCTION_WRITE_KEY_IOS,
          android: __DEV__
            ? Config.SEGMENT_STAGING_WRITE_KEY_ANDROID
            : Config.SEGMENT_PRODUCTION_WRITE_KEY_ANDROID,
          default: "",
        }),
        {
          using: [Braze],
        }
      )
      .then(() => console.log("Analytics is ready"))
      .catch((err) => console.error("Something went wrong", err))
  },

  identify: (userId, traits) => {
    analytics.identify(userId, traits)
  },

  postEvent: (info) => {
    addBreadcrumb({
      message: `${JSON.stringify(info, null, 2)}`,
      category: "analytics",
    })

    // Events bubbled up from ios native
    if ("screen_name" in info) {
      const { screen_name, ...rest } = info
      visualize("Screen", screen_name, info, visualizeDevToggle)
      analytics.screen(screen_name, rest as any)
      return
    }

    if ("action" in info) {
      const { action } = info
      if (isCohesionScreen(info)) {
        const { context_screen_owner_type } = info
        visualize("Screen", context_screen_owner_type, info, visualizeDevToggle)
        analytics.screen(context_screen_owner_type, info as any)
      } else {
        visualize("Track", action, info, visualizeDevToggle)
        analytics.track(action, info as any)
      }
      return
    }

    if ("action_type" in info) {
      const { action_type, ...rest } = info
      visualize("Track", action_type, info, visualizeDevToggle)
      analytics.track(action_type, rest as any)
      return
    }

    if ("name" in info) {
      const { name, ...rest } = info
      visualize("Track", name, info, visualizeDevToggle)
      analytics.track(name, rest as any)
      return
    }

    if ("context_screen" in info) {
      const { context_screen, ...rest } = info
      visualize("Screen", context_screen, info, visualizeDevToggle)
      analytics.screen(context_screen, rest as any)
      return
    }

    // default check events from ios native
    if ("event_name" in info) {
      const { event_name, ...rest } = info
      visualize("Track", event_name, info, visualizeDevToggle)
      analytics?.track?.(event_name, rest)
      return
    }

    console.warn("oh wow, we are not tracking this event!! we should!", { info })
    assertNever(info)
  },
}
