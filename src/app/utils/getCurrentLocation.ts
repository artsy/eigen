import Geolocation from "@react-native-community/geolocation"
import { Location } from "app/utils/hooks/useLocation"
import { PermissionsAndroid, Platform } from "react-native"

const TIMEOUT = 10000
const MAXIMUM_AGE = 30000
// Coarser than this, the address can be a street away. iOS with Precise Location off reports km
const MAX_ACCURACY_METERS = 200

export type CurrentLocation =
  | { status: "located"; location: Location }
  /** Approximate location only, which can land a street away */
  | { status: "approximate" }
  | { status: "denied" }
  | { status: "unavailable" }

type Permission = "granted" | "approximate" | "denied"

const requestPermission = async (): Promise<Permission> => {
  if (Platform.OS === "android") {
    const { ACCESS_FINE_LOCATION, ACCESS_COARSE_LOCATION } = PermissionsAndroid.PERMISSIONS
    // Some Android 12 builds ignore a request for fine location on its own
    const results = await PermissionsAndroid.requestMultiple([
      ACCESS_FINE_LOCATION,
      ACCESS_COARSE_LOCATION,
    ])

    if (results[ACCESS_FINE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED) {
      return "granted"
    }
    if (results[ACCESS_COARSE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED) {
      return "approximate"
    }
    return "denied"
  }

  return new Promise<Permission>((resolve) => {
    Geolocation.requestAuthorization(
      () => resolve("granted"),
      () => resolve("denied")
    )
  })
}

/** Asks for precise location permission when needed and returns the device's position */
export const getCurrentLocation = async (): Promise<CurrentLocation> => {
  const permission = await requestPermission()

  if (permission !== "granted") {
    return { status: permission }
  }

  return new Promise((resolve) => {
    Geolocation.getCurrentPosition(
      ({ coords }) =>
        resolve(
          coords.accuracy > MAX_ACCURACY_METERS
            ? { status: "approximate" }
            : { status: "located", location: { lat: coords.latitude, lng: coords.longitude } }
        ),
      () => resolve({ status: "unavailable" }),
      // The defaults allow a coarse fix and a cached position of any age
      { timeout: TIMEOUT, enableHighAccuracy: true, maximumAge: MAXIMUM_AGE }
    )
  })
}
