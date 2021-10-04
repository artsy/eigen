import { Dimensions, ViewStyle } from "react-native"

export const useOffscreenStyle = (): ViewStyle => {
  const { width, height } = Dimensions.get("window")

  return {
    position: "absolute",
    top: width + height,
    left: width + height,
  }
}
