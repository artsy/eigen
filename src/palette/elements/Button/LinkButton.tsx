import { Text, TextProps, Touchable } from "palette"
import React from "react"

export const LinkButton = (props: TextProps) => (
  <Touchable onPress={props.onPress}>
    <Text underline {...props} />
  </Touchable>
)
