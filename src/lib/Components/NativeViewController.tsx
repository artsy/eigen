import React from "react"
import { requireNativeComponent } from "react-native"

const ARNativeViewController = requireNativeComponent("ARNativeViewController") as any

export const NativeViewController: React.FC<{
  viewName: "Onboarding" | "Main"
}> = ({ viewName }) => {
  return <ARNativeViewController style={{ flex: 1 }} key={viewName} viewName={viewName} />
}
