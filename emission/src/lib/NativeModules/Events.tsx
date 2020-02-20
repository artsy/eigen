import { NativeModules } from "react-native"
const { AREventsModule, Emission } = NativeModules

function postEvent(info: any) {
  if (__DEV__) {
    console.log("[Event tracked]", JSON.stringify(info, null, 2))
  }
  AREventsModule.postEvent(info)
}

// Whether we have requested during the current session or not.
let hasRequested = false
/**
 * Callback for when user has meaningfully interacted with the app (eg: followed an artist).
 * This method is designed to be called often, and it encapsulates all logic necessary for
 * deciding whether or not to prompt the user for an app rating.
 */
function userHadMeaningfulInteraction() {
  const launchCount = Emission.launchCount

  // We choose to ask the user on their second session, as well as their 22nd, 42nd, etc.
  // Apple will only ever ask the user to rate the app 3 times in a year, and we want to
  // space out how often we ask for a rating so users have gotten a sense of the app's value.
  if (launchCount % 20 === 2) {
    if (!hasRequested) {
      hasRequested = true
      AREventsModule.requestAppStoreRating()
    }
  }
}

export default { postEvent, userHadMeaningfulInteraction }
