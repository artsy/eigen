import { css } from "styled-components"
import { color } from "../../helpers"
import { styledWrapper } from "../../platform/primitives"
import { BorderBoxBase, BorderBoxProps } from "./BorderBoxBase"

/**
 * A `div` that has a common border and padding set by default, with an optional
 * `hover` property for visually focusing content.
 */
export const BorderBox = styledWrapper(BorderBoxBase)<BorderBoxProps>`
  ${({ hover }) =>
    hover &&
    css`
      :hover {
        border-color: ${color("black60")};
      }
    `};
`

BorderBox.displayName = "BorderBox"
