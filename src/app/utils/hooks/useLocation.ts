import Geolocation from "@react-native-community/geolocation"
import { useEffect, useState } from "react"
import { PermissionsAndroid, Platform } from "react-native"

export interface Location {
  lat: number
  lng: number
}

const REQUEST_PERMISSION_DELAY = 1000
const MAX_AGE = 1000 * 60 * 10 // 10 minutes

Geolocation.setRNConfiguration({ skipPermissionRequests: true })

/**
 * Returns the user's location if available, otherwise returns the user's IP address
 * Usage:
 *   const { isLoading, location, ip } = useLocation({ diabled: false, skipPermissionRequests: true })
 */
export const useLocation = ({ disabled = false, skipPermissionRequests = false } = {}) => {
  const [isLoading, setIsLoading] = useState(!disabled)
  const [permissionRequested, setPermissionRequested] = useState(false)
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
        { timeout: 3000, maximumAge: MAX_AGE }
      )
    } else {
      setIsLoading(false)
    }
  }

  const requestPermission = () => {
    // Adding a delay to avoid requesting permission before the screen rendered
    setTimeout(() => {
      Geolocation.requestAuthorization(
        () => {
          setPermissionRequested(true)
        },

        (error) => {
          console.log("Couldn't request permission to use device's location.", error)
          setPermissionRequested(true)
        }
      )
    }, REQUEST_PERMISSION_DELAY)
  }

  useEffect(() => {
    if (disabled || skipPermissionRequests || permissionRequested) return

    requestPermission()
  }, [skipPermissionRequests, disabled])

  useEffect(() => {
    if (disabled) return

    getLocation()
  }, [disabled, permissionRequested])

  return { isLoading, location }
}
