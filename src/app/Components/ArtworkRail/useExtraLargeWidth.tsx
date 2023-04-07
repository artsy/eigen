import { useSpace } from "@artsy/palette-mobile"
import { isPad } from "app/utils/hardware"
import { useScreenDimensions } from "app/utils/hooks"

export const useExtraLargeWidth = () => {
  const isTablet = isPad()
  const space = useSpace()
  const { width } = useScreenDimensions()
  const extraLargeWidth = isTablet ? 400 : width - space(6)
  return extraLargeWidth
}
