import React from "react"
import { requireNativeComponent } from "react-native"

const ARNativeViewController = requireNativeComponent("ARNativeViewController") as any

export const NativeViewController: React.FC<{
  viewName: "Onboarding" | "Main" | "WOW"
  viewProps?: object
}> = ({ viewName, viewProps = {} }) => {
  return <ARNativeViewController style={{ flex: 1 }} key={viewName} viewName={viewName} viewProps={viewProps} />
}
