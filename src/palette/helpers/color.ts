import { Color, themeProps } from "../Theme"

/**
 * A helper to easily access colors when not in a styled-components or
 * styled-systems context.
 */
export const color = (colorKey: Color) => themeProps.colors[colorKey]
