import { useSpace } from "@artsy/palette-mobile"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export const useArtworkListsBottomOffset = () => {
  const insets = useSafeAreaInsets()
  const space = useSpace()

  // Device has bottom safe area
  if (insets.bottom > 0) {
    return insets.bottom
  }

  return space(2)
}
