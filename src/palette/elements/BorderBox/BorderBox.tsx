import { SpaceProps } from "palette/helpers"
// @ts-ignore
import React from "react"
import { border, BorderProps, space as styledSpace } from "styled-system"
import { styledWrapper } from "../../platform/primitives"
import { color, space } from "../../Theme"
import { Flex, FlexProps } from "../Flex"

export interface BorderBoxProps extends FlexProps, BorderProps, SpaceProps {
  hover?: boolean
}

/**
 * A `View` or `div` (depending on the platform) that has a common border
 * and padding set by default
 */
export const BorderBox = styledWrapper(Flex)<BorderBoxProps>`
  border: 1px solid ${color("black10")};
  border-radius: 2px;
  padding: ${space(2)}px;
  ${border}
  ${styledSpace}
`
