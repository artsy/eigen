import { Platform } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

// Adjusted top padding for elements below safe area on Android and iOS
export const fullScreenSafeTopPadding = () => {
  const safeArea = useSafeAreaInsets()
  if (Platform.OS === "ios") {
    if (safeArea.top - 40 > 0) {
      // safe area is accounting for nav bar
      return safeArea.top - 40
    } else {
      return safeArea.top
    }
  } else {
    return safeArea.top
  }
}
