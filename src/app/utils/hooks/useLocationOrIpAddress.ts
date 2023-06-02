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
 *   const { isLoading, location, ip } = useLocationOrIpAddress()
 */
export const useLocationOrIpAddress = (disabled = false) => {
  const [isLoading, setIsLoading] = useState(!disabled)
  const [location, setLocation] = useState<Location | null>(null)
  const [ipAddress, setIpAddress] = useState<string | null>(null)

  const getIpAddress = async () => {
    try {
      const response = await fetch("https://api.ipify.org")
      const ip = await response.text()

      setIpAddress(ip)
    } catch (error) {
      console.log("Failed to get devices IP address for location.", error)
    } finally {
      setIsLoading(false)
    }
  }

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
          console.log("Couldn't get device's location. Falling back to IP address", error)
          // Get IP address as a fallback
          getIpAddress()
        },
        { timeout: 15000, maximumAge: 10000 }
      )
    } else {
      getIpAddress()
    }
  }

  useEffect(() => {
    if (disabled) {
      return
    }

    getLocation()
  }, [disabled])

  return { isLoading, location, ipAddress }
}
