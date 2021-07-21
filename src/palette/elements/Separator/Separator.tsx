import { themeGet } from "@styled-system/theme-get"
// @ts-ignore
import React from "react"
import styled from "styled-components/native"
import { border, BorderProps, space, SpaceProps, width, WidthProps } from "styled-system"

export interface SeparatorProps extends SpaceProps, WidthProps, BorderProps {}

/**
 * A horizontal divider whose width and spacing can be adjusted
 */
export const Separator = styled.View<SeparatorProps>`
  border: 1px solid ${themeGet("colors.black10")};
  border-bottom-width: 0;
  ${space};
  ${width};
  ${border};
`

Separator.defaultProps = {
  width: "100%",
}
