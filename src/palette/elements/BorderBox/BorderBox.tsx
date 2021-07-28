import { themeGet } from "@styled-system/theme-get"
// @ts-ignore
import React from "react"
import styled from "styled-components/native"
import { border, BorderProps, space as styledSpace, SpaceProps } from "styled-system"
import { Flex, FlexProps } from "../Flex"

export interface BorderBoxProps extends FlexProps, BorderProps, SpaceProps {
  hover?: boolean
}

/**
 * A `View` or `div` (depending on the platform) that has a common border
 * and padding set by default
 */
export const BorderBox = styled(Flex)<BorderBoxProps>`
  border: 1px solid ${themeGet("colors.black10")};
  border-radius: 2px;
  padding: ${themeGet("space.2")}px;
  ${border}
  ${styledSpace}
`
