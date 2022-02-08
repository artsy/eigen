import React, { ReactNode } from "react"
import { View } from "react-native"

interface Props {
  isOpen: boolean
  children: ReactNode
}

export const CollapseView: React.FC<Props> = ({ isOpen, children }) => {
  return <>{isOpen ? <View>{children}</View> : null}</>
}
