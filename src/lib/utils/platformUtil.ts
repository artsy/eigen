import { Platform } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

// FIXME: iOS modal presentation adds safe area insets
// When we unify modal presentation we should be able to remove this code
export const backButtonTopPadding = () => {
  if (Platform.OS === "ios") {
    return 0
  } else {
    return 13 + useSafeAreaInsets().top
  }
}
