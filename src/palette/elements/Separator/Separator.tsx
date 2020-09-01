// @ts-ignore
import React from "react"

import { space, SpaceProps, width, WidthProps } from "styled-system"
import { color } from "../../helpers"
import { styled as primitives } from "../../platform/primitives"

export interface SeparatorProps extends SpaceProps, WidthProps {}

/**
 * A horizontal divider whose width and spacing can be adjusted
 */
export const Separator = primitives.View<SeparatorProps>`
  border: 1px solid ${color("black10")};
  border-bottom-width: 0;
  ${space};
  ${width};
`

Separator.defaultProps = {
  width: "100%",
}
