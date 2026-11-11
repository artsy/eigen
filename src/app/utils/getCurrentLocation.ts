import Geolocation from "@react-native-community/geolocation"
import { Location } from "app/utils/hooks/useLocation"
import { PermissionsAndroid, Platform } from "react-native"

const TIMEOUT = 10000

const requestPermission = async () => {
  if (Platform.OS === "android") {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    )
    return result === PermissionsAndroid.RESULTS.GRANTED
  }

  return new Promise<boolean>((resolve) => {
    Geolocation.requestAuthorization(
      () => resolve(true),
      () => resolve(false)
    )
  })
}

/** Asks for location permission when needed and returns the device's position, or null */
export const getCurrentLocation = async (): Promise<Location | null> => {
  if (!(await requestPermission())) {
    return null
  }

  return new Promise((resolve) => {
    Geolocation.getCurrentPosition(
      ({ coords }) => resolve({ lat: coords.latitude, lng: coords.longitude }),
      () => resolve(null),
      { timeout: TIMEOUT }
    )
  })
}
