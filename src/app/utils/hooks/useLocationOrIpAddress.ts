import Geolocation from "@react-native-community/geolocation"
import { useEffect, useState } from "react"
import { NetworkInfo } from "react-native-network-info"

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
      // Get IPv4 IP (priority: WiFi first, cellular second)
      const ipv4Address = await NetworkInfo.getIPV4Address()

      setIpAddress(ipv4Address)
    } catch (error) {
      console.log("Failed to get devices IP address for location.", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getLocation = () => {
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
  }

  useEffect(() => {
    if (disabled) {
      return
    }

    getLocation()
  }, [disabled])

  return { isLoading, location, ipAddress }
}
