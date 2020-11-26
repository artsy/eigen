import type { AppModuleName } from "lib/AppRegistry"
import type { BottomTabType } from "lib/Scenes/BottomTabs/BottomTabType"
import React from "react"
import { requireNativeComponent } from "react-native"

const ARNativeViewController = requireNativeComponent("ARNativeViewController") as any

type NativeViewProps =
  | {
      viewName: "Onboarding"
      viewProps?: undefined
    }
  | {
      viewName: "TabNavigationStack"
      viewProps: {
        tabName: BottomTabType
        rootModuleName: AppModuleName
      }
    }

export const NativeViewController: React.FC<NativeViewProps> = ({ viewName, viewProps }) => {
  return <ARNativeViewController style={{ flex: 1 }} key={viewName} viewName={viewName} viewProps={viewProps ?? {}} />
}
