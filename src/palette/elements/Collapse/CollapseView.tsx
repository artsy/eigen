import React from "react"
import { View } from "react-native"

export const CollapseView: React.FC<{ isOpen: boolean }> = ({ isOpen, children }) =>
  isOpen ? <View>{children}</View> : null
