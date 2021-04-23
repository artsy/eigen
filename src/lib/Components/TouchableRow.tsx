import { color, Touchable, TouchableProps } from "palette"
import React from "react"

export type TouchableRowProps = TouchableProps

export const TouchableRow: React.FC<TouchableRowProps> = ({ children, ...rest }) => (
  <Touchable underlayColor={color("black5")} {...rest}>
    {children}
  </Touchable>
)
