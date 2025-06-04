import { postEventToProviders } from "app/utils/track/providers"
import { useEffect } from "react"
import DeviceInfo from "react-native-device-info"
import { useTracking } from "react-tracking"

// the purpose of this hook is to track once the fontScale of the user's device
export const useFontScaleTracking = () => {
  const { trackEvent } = useTracking()

  useEffect(() => {
    const getFontScale = async () => {
      try {
        const fontScale = await DeviceInfo.getFontScale()

        postEventToProviders({ name: "FontScale", value: fontScale })

        return fontScale
      } catch (error) {
        console.error("Error getting font scale: ", error)
      }
      return
    }

    getFontScale()
  }, [trackEvent])
}
