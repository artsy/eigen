import { useTheme } from "palette"
import React from "react"
import { Dimensions, View, ViewProps } from "react-native"

const negativeMargin = Dimensions.get("window").width > 700 ? -40 : -20

export const Separator: React.FC<ViewProps> = ({ style }) => {
  const { color } = useTheme()

  return (
    <View
      style={[
        {
          height: 1,
          marginLeft: negativeMargin,
          marginRight: negativeMargin,
          backgroundColor: color("black10"),
        },
        style,
      ]}
    />
  )
}
