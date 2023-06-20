import Geolocation from "@react-native-community/geolocation"
import { useEffect, useState } from "react"
import { PermissionsAndroid, Platform } from "react-native"

export interface Location {
  lat: number
  lng: number
}

Geolocation.setRNConfiguration({ skipPermissionRequests: true })

/**
 * Returns the user's location if available, otherwise returns the user's IP address
 * Usage:
 *   const { isLoading, location, ip } = useLocation()
 */
export const useLocation = (disabled = false) => {
  const [isLoading, setIsLoading] = useState(!disabled)
  const [location, setLocation] = useState<Location | null>(null)

  const getLocation = async () => {
    let granted = false

    // Check if we have location permissions for Android to avoid the app crashing
    if (Platform.OS === "android") {
      granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
    } else {
      granted = true
    }

    if (granted) {
      Geolocation.getCurrentPosition(
        (position) => {
          setLocation({ lat: position.coords.latitude, lng: position.coords.longitude })

          setIsLoading(false)
        },
        (error) => {
          console.log("Couldn't get device's location.", error)

          setIsLoading(false)
        },
        { timeout: 3000, maximumAge: 10000 }
      )
    } else {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (disabled) {
      return
    }

    getLocation()
  }, [disabled])

  return { isLoading, location }
}
