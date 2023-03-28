import { Flex, useColor } from "@artsy/palette-mobile"
import { StyleProp, ViewStyle } from "react-native"

const DOT_DIAMETER = 6

interface VisualClueDotProps {
  diameter?: number
  style?: StyleProp<ViewStyle>
}

export const VisualClueDot: React.FC<VisualClueDotProps> = ({ diameter = DOT_DIAMETER, style }) => {
  const color = useColor()

  return (
    <Flex
      style={{
        height: diameter,
        minWidth: diameter,
        borderRadius: diameter / 2,
        backgroundColor: color("blue100"),
        ...(style as object),
      }}
    />
  )
}
