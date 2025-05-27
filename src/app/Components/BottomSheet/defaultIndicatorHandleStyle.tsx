import { ColorFn } from "@artsy/palette-mobile"

export const defaultIndicatorHandleStyle = (color: ColorFn) => {
  return {
    backgroundColor: color("mono100"),
    width: 40,
    height: 4,
    borderRadius: 2,
  }
}
