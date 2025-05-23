import { useColor } from "@artsy/palette-mobile"

export const defaultIndicatorHandleStyle = (color: ReturnType<typeof useColor>) => {
  return {
    backgroundColor: color("mono100"),
    width: 40,
    height: 4,
    borderRadius: 2,
  }
}
