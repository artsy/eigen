import { isTablet } from "react-native-device-info"

export const useArtworkListsColCount = () => {
  if (isTablet()) {
    return 3
  }

  return 2
}
