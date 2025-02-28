import { useScreenDimensions } from "@artsy/palette-mobile"

export const useScreenWidthWithOffset = () => {
  const { width } = useScreenDimensions()
  return width + 100
}
