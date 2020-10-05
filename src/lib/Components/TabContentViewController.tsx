import React from "react"
import { requireNativeComponent } from "react-native"

const ARTabContentViewController = requireNativeComponent("ARTabContentViewController") as any

export const TabContentViewController: React.FC = () => {
  return <ARTabContentViewController style={{ flex: 1 }} />
}
