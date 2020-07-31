import { color } from "@artsy/palette"
import React from "react"
import { TouchableHighlight, TouchableHighlightProps, View } from "react-native"

export const Touchable: React.FC<TouchableHighlightProps> = ({ children, ...props }) => (
  <TouchableHighlight underlayColor={color("white100")} activeOpacity={0.8} {...props}>
    <View>{children}</View>
  </TouchableHighlight>
)
