import { Color, themeProps } from "../Theme"

/**
 * A helper to easily access colors when not in a styled-components or
 * styled-systems context.
 */
export function color(colorKey: undefined): undefined
export function color(colorKey: Color): Color
export function color(colorKey: Color | undefined): Color | undefined
export function color(colorKey: any) {
  if (colorKey === undefined) {
    return undefined
  }

  return themeProps.colors[colorKey as Color]
}
