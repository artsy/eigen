import { useSafeAreaInsets } from "react-native-safe-area-context"

export const backButtonTopPadding = () => {
  return 13 + useSafeAreaInsets().top
}
