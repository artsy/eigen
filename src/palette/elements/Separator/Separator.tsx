import { SpaceProps } from "palette/helpers"
// @ts-ignore
import React from "react"
import { border, BorderProps, space, width, WidthProps } from "styled-system"
import { styled as primitives } from "../../platform/primitives"
import { color } from "../../Theme"

export interface SeparatorProps extends SpaceProps, WidthProps, BorderProps {}

/**
 * A horizontal divider whose width and spacing can be adjusted
 */
export const Separator = primitives.View<SeparatorProps>`
  border: 1px solid ${color("black10")};
  border-bottom-width: 0;
  ${space};
  ${width};
  ${border};
`

Separator.defaultProps = {
  width: "100%",
}
