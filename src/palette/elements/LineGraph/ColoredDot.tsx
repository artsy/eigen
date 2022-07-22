import React from "react"
import { Flex } from "../Flex"
import { getColorByMedium } from "./helpers"

const DOT_DIAMETER = 8

interface Props {
  selectedMedium: string | null
  disabled?: boolean
}

export const ColoredDot: React.FC<Props> = ({ selectedMedium, disabled = false }) => {
  return (
    <Flex
      backgroundColor={!disabled ? getColorByMedium(selectedMedium) : "#707070"}
      width={DOT_DIAMETER}
      height={DOT_DIAMETER}
      borderRadius={DOT_DIAMETER / 2}
      marginTop="2px"
      marginRight={0.5}
      testID="colored-dot"
    />
  )
}
