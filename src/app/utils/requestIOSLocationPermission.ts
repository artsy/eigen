import Geolocation from "@react-native-community/geolocation"
import { AppState } from "react-native"

// Same as `useLocation`
const LOCATION_TIMEOUT = 3000
const LOCATION_MAX_AGE = 1000 * 60 * 10 // 10 minutes

/** How long the iOS prompt may take to take focus from the app before we assume there's none */
const IOS_PROMPT_DETECTION_DELAY = 1000
/** `GeolocationError.code` for a denied permission */
const ERROR_PERMISSION_DENIED = 1

// Permissions are requested explicitly; never let a position lookup prompt on its own.
// `useLocation` sets the same, but only once its module has loaded.
Geolocation.setRNConfiguration({ skipPermissionRequests: true })

/**
 * - "granted"
 * - "denied": the user declined the prompt just now, so nothing should happen
 * - "blocked": no prompt could be shown anymore, so only Settings can grant access
 */
export type PermissionResult = "granted" | "denied" | "blocked"

/**
 * iOS shows the location prompt once; afterwards the request fails right away, with no system UI.
 * Geolocation reports both failures the same way, so the prompt is detected instead: while it's on
 * screen the app is `inactive`.
 */
export const requestIOSLocationPermission = () =>
  new Promise<PermissionResult>((resolve) => {
    let wasPromptShown = false

    // `requestAuthorization` only calls back when the authorization status changes, so once the
    // user has answered the prompt it never calls back. If no prompt shows up, the status was
    // already decided: ask for a position to tell granted from denied.
    const noPromptTimer = setTimeout(() => {
      if (wasPromptShown) return

      Geolocation.getCurrentPosition(
        () => settle("granted"),
        // Only a denial is an answer: a timeout or no fix still means access was granted
        (error) => settle(error.code === ERROR_PERMISSION_DENIED ? "blocked" : "granted"),
        { timeout: LOCATION_TIMEOUT, maximumAge: LOCATION_MAX_AGE }
      )
    }, IOS_PROMPT_DETECTION_DELAY)

    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "inactive") wasPromptShown = true
    })

    const settle = (result: PermissionResult) => {
      clearTimeout(noPromptTimer)
      subscription.remove()
      resolve(result)
    }

    Geolocation.requestAuthorization(
      () => settle("granted"),
      () => settle(wasPromptShown ? "denied" : "blocked")
    )
  })
