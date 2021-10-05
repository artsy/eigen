import { Dimensions, ViewStyle } from "react-native"

export const useOffscreenStyle = (notOffscreen?: boolean): ViewStyle => {
  if (notOffscreen) {
    return { position: "absolute", top: 0, left: 0 }
  }

  const { width, height } = Dimensions.get("window")
  return { position: "absolute", top: width + height, left: width + height }
}
