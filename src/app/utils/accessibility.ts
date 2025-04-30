import { PixelRatio } from "react-native"

export const isLargeText = () => {
  return PixelRatio.getFontScale() >= 1.5
}
