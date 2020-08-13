import { color, Flex } from "@artsy/palette"
import React from "react"
import { TouchableHighlight, TouchableHighlightProps } from "react-native"

export const Touchable: React.FC<TouchableHighlightProps & { flex?: number }> = ({ children, flex, ...props }) => (
  <TouchableHighlight underlayColor={color("white100")} activeOpacity={0.8} {...props}>
    <Flex flex={flex}>{children}</Flex>
  </TouchableHighlight>
)
