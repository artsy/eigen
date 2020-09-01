import { SpacingUnit, themeProps } from "../Theme"

/**
 * A helper to easily access space values when not in a styled-components or
 * styled-systems context.
 */
export const space = (spaceKey: SpacingUnit): number => {
  return parseInt(themeProps.space[spaceKey], 10)
}
