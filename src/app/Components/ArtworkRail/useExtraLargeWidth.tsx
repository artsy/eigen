import { useSpace } from "@artsy/palette-mobile"
import { useScreenDimensions } from "app/utils/hooks"
import { isTablet } from "react-native-device-info"

export const useExtraLargeWidth = () => {
  const space = useSpace()
  const { width } = useScreenDimensions()
  const extraLargeWidth = isTablet() ? 400 : width - space(6)
  return extraLargeWidth
}
