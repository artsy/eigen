import { Flex, useColor } from "palette"
import React from "react"
import { StyleProp, ViewStyle } from "react-native"

const DOT_DIAMETER = 6

export const VisualClueDot: React.FC<{ style?: StyleProp<ViewStyle> }> = ({ style }) => {
  const color = useColor()

  return (
    <Flex
      style={{
        height: DOT_DIAMETER,
        minWidth: DOT_DIAMETER,
        borderRadius: DOT_DIAMETER / 2,
        backgroundColor: color("blue100"),
        ...(style as object),
      }}
    />
  )
}
