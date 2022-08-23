import React from "react"
import { Flex } from "../Flex"

const DOT_DIAMETER = 8

interface Props {
  color: string
  disabled?: boolean
}

export const DEFAULT_DOT_COLOR = "#707070"
export const ColoredDot: React.FC<Props> = ({ color, disabled = false }) => {
  return (
    <Flex
      backgroundColor={!disabled ? color : DEFAULT_DOT_COLOR}
      width={DOT_DIAMETER}
      height={DOT_DIAMETER}
      borderRadius={DOT_DIAMETER / 2}
      marginTop="2px"
      marginRight={0.5}
      testID="colored-dot"
    />
  )
}
