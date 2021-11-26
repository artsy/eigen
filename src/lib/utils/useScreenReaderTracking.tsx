import { useEffect } from "react"
import { AccessibilityInfo } from "react-native"

// the purpose of this hook is to track the screen reader status of the user's device
export const useScreenReaderTracking = () => {
  useEffect(() => {
    const getScreenReaderStatus = async () => {
      const isScreenReaderEnabled = await AccessibilityInfo.isScreenReaderEnabled()
      console.warn({ isScreenReaderEnabled })
      return isScreenReaderEnabled
    }

    getScreenReaderStatus()

    // track screen reader status
  }, [])
}
