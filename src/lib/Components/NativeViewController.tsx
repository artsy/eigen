import type { NativeAppModule } from "lib/AppRegistry"
import React from "react"
import { requireNativeComponent } from "react-native"

const ARNativeViewController = requireNativeComponent("ARNativeViewController") as any

interface NativeViewProps {
  viewName: "Onboarding" | NativeAppModule
  viewProps?: object
}

export const NativeViewController: React.FC<NativeViewProps> = ({ viewName, viewProps }) => {
  return <ARNativeViewController style={{ flex: 1 }} key={viewName} viewName={viewName} viewProps={viewProps ?? {}} />
}
