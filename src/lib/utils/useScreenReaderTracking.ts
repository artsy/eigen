import { useEffect, useState } from "react"
import { AccessibilityInfo } from "react-native"
import { postEventToProviders } from "./track/providers"

// the purpose of this hook is to track the screen reader status of the user's device
export const useScreenReaderTracking = () => {
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false)
  useEffect(() => {
    const getScreenReaderStatus = async () => {
      const isEnabled = await AccessibilityInfo.isScreenReaderEnabled()
      setIsScreenReaderEnabled(isEnabled)
    }

    getScreenReaderStatus()
    postEventToProviders(tracks.trackScreenReaderStatus(isScreenReaderEnabled))
  }, [])
}

export const tracks = {
  trackScreenReaderStatus: (isScreenReaderEnabled: boolean) => ({
    name: "screen_reader_enabled",
    screen_reader_enabled: isScreenReaderEnabled,
  }),
}
