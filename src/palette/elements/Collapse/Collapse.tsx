import React from "react"
import { View } from "react-native"

export const Collapse: React.FC<{ opened: boolean }> = ({ opened, children }) =>
  opened ? <View>{children}</View> : null
