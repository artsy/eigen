import React from "react"
import { StyleProp, ViewStyle } from "react-native"

export const artsyStyled =
  <P extends { style?: StyleProp<ViewStyle> }>(Component: React.ComponentType<P>) =>
  (styleProps: StyleProp<ViewStyle>) =>
  (props: P) =>
    <Component {...props} style={[props.style, styleProps]} />
