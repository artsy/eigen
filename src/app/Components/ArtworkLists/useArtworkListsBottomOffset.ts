import { useSpace } from "@artsy/palette-mobile"
import { useSafeAreaInsets } from "react-native-safe-area-context"

type Callback = ReturnType<typeof useSpace>
type SpaceName = Parameters<Callback>[0]

export const useArtworkListsBottomOffset = (defaultSpace: SpaceName) => {
  const insets = useSafeAreaInsets()
  const space = useSpace()

  // Device has bottom safe area
  if (insets.bottom > 0) {
    return insets.bottom
  }

  return space(defaultSpace)
}
