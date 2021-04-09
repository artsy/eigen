import { Platform } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

// FIXME: iOS modal presentation adds safe area insets
// When we unify modal presentation we should be able to remove this code
export const useBackButtonTopPadding = () => {
  if (Platform.OS === "ios") {
    return 0
  } else {
    return 13 + useSafeAreaInsets().top
  }
}

export const osMajorVersion = () => {
  if (typeof (Platform.Version === "string")) {
    return parseInt(Platform.Version as string, 10)
  } else {
    return Platform.Version as number
  }
}
