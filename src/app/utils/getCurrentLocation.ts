import Geolocation from "@react-native-community/geolocation"
import { Location } from "app/utils/hooks/useLocation"
import { requestIOSLocationPermission } from "app/utils/requestIOSLocationPermission"
import { PermissionsAndroid, Platform } from "react-native"

const TIMEOUT = 10000
const MAXIMUM_AGE = 30000
// Coarser than this, the address can be a street away. iOS with Precise Location off reports km
const MAX_ACCURACY_METERS = 200

export type CurrentLocation =
  | { status: "located"; location: Location }
  /** Approximate location only, which can land a street away */
  | { status: "approximate" }
  /** The user declined the prompt just now */
  | { status: "denied" }
  /** Location was denied before and can't be asked for again: only Settings can grant it */
  | { status: "blocked" }
  | { status: "unavailable" }

type Permission = "granted" | "approximate" | "denied" | "blocked"

const requestAndroidPermission = async (): Promise<Permission> => {
  const { ACCESS_FINE_LOCATION, ACCESS_COARSE_LOCATION } = PermissionsAndroid.PERMISSIONS
  const { GRANTED, NEVER_ASK_AGAIN } = PermissionsAndroid.RESULTS
  // Some Android 12 builds ignore a request for fine location on its own
  const results = await PermissionsAndroid.requestMultiple([
    ACCESS_FINE_LOCATION,
    ACCESS_COARSE_LOCATION,
  ])

  if (results[ACCESS_FINE_LOCATION] === GRANTED) {
    return "granted"
  }
  if (results[ACCESS_COARSE_LOCATION] === GRANTED) {
    return "approximate"
  }
  return results[ACCESS_FINE_LOCATION] === NEVER_ASK_AGAIN ? "blocked" : "denied"
}

const getPosition = (enableHighAccuracy: boolean) =>
  new Promise<CurrentLocation>((resolve) => {
    Geolocation.getCurrentPosition(
      ({ coords }) =>
        resolve(
          coords.accuracy > MAX_ACCURACY_METERS
            ? { status: "approximate" }
            : { status: "located", location: { lat: coords.latitude, lng: coords.longitude } }
        ),
      () => resolve({ status: "unavailable" }),
      // The defaults allow a coarse fix and a cached position of any age
      { timeout: TIMEOUT, enableHighAccuracy, maximumAge: MAXIMUM_AGE }
    )
  })

/** Asks for precise location permission when needed and returns the device's position */
export const getCurrentLocation = async (): Promise<CurrentLocation> => {
  const permission =
    Platform.OS === "android"
      ? await requestAndroidPermission()
      : await requestIOSLocationPermission()

  if (permission !== "granted") {
    return { status: permission }
  }

  const position = await getPosition(true)

  // Android's high accuracy uses GPS alone, which often has no fix indoors; Wi‑Fi can still do
  return position.status === "unavailable" ? getPosition(false) : position
}
