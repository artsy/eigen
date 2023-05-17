import Geolocation from "@react-native-community/geolocation"
import { useState, useEffect } from "react"
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
export const useLocationOrIpAddress = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [location, setLocation] = useState<Location | null>(null)
  const [ipAddress, setIpAddress] = useState<string | null>(null)

  const getIpAddress = async () => {
    try {
      // Get IPv4 IP (priority: WiFi first, cellular second)
      const ipv4Address = await NetworkInfo.getIPV4Address()

      setIpAddress(ipv4Address)
    } catch (error) {
      console.error("Failed to get IPv4 address.", error)
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
        console.error("Failed to get current position. Falling back to IP address", error)
        // Get IP address as a fallback
        getIpAddress()
      },
      { timeout: 15000, maximumAge: 10000 }
    )
  }

  useEffect(() => {
    getLocation()
  }, [])

  return { isLoading, location, ipAddress }
}
