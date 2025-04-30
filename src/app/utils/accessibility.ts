import { PixelRatio } from "react-native"

export const isFontScaleLarge = () => {
  return PixelRatio.getFontScale() >= 1.5
}
