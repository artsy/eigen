import React from "react"
import { View } from "react-native"

export const Collapse: React.FC<{ isOpen: boolean }> = ({ isOpen, children }) =>
  isOpen ? <View>{children}</View> : null
