import { Dimensions, Platform } from "react-native"

export const isPad = () => {
  if (Platform.OS === "ios") {
    return Platform.isPad
  }

  // let's say a device is a tablet if the screen's smallest dimension (the width in portrait mode) is more than 3.5"
  const { width, height } = Dimensions.get("screen")

  const portraitWidthNormalizedPixels = Math.min(width, height)

  const NORMAL_DPI = 160 // this comes from https://material.io/blog/device-metrics
  const portraitWidthInches = portraitWidthNormalizedPixels / NORMAL_DPI

  return portraitWidthInches > 3.5
}

export const truncatedTextLimit = () => (isPad() ? 320 : 140)
