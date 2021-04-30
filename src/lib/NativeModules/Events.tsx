import { addBreadcrumb } from "@sentry/react-native"
import { LegacyNativeModules } from "lib/NativeModules/LegacyNativeModules"
import { getCurrentEmissionState } from "lib/store/GlobalStore"
import { TrackingProvider } from "lib/utils/track"

function postEvent(info: any) {
  addBreadcrumb({
    message: `${JSON.stringify(info, null, 2)}`,
    category: "analytics",
  })

  LegacyNativeModules.AREventsModule.postEvent(info)
}

// Whether we have requested during the current session or not.
let hasRequested = false
/**
 * Callback for when user has meaningfully interacted with the app (eg: followed an artist).
 * This method is designed to be called often, and it encapsulates all logic necessary for
 * deciding whether or not to prompt the user for an app rating.
 */
export function userHadMeaningfulInteraction() {
  const launchCount = getCurrentEmissionState().launchCount

  // We choose to ask the user on their second session, as well as their 22nd, 42nd, etc.
  // Apple will only ever ask the user to rate the app 3 times in a year, and we want to
  // space out how often we ask for a rating so users have gotten a sense of the app's value.
  if (launchCount % 20 === 2) {
    if (!hasRequested) {
      hasRequested = true
      LegacyNativeModules.AREventsModule.requestAppStoreRating()
    }
  }
}

export const NativeAnalyticsProvider: TrackingProvider = {
  postEvent,
}
