import { Flex } from "@artsy/palette-mobile"
import React from "react"

const DOT_DIAMETER = 8

interface Props {
  color?: string
  size?: number
}

export const DEFAULT_DOT_COLOR = "#707070"
export const ColoredDot: React.FC<Props> = ({ color = DEFAULT_DOT_COLOR, size = DOT_DIAMETER }) => {
  return (
    <Flex
      backgroundColor={color}
      width={size}
      height={size}
      borderRadius={size / 2}
      marginTop="2px"
      marginRight={0.5}
      testID="colored-dot"
    />
  )
}
