import type { AppModule } from "app/AppRegistry"
import type { BottomTabType } from "app/Scenes/BottomTabs/BottomTabType"
import React from "react"
import { requireNativeComponent } from "react-native"

const ARNativeTabs = requireNativeComponent("ARNativeTabs") as any

interface NativeTabsProps {
  viewProps: {
    tabName: BottomTabType
    rootModuleName: AppModule
  }
}

export const NativeTabs: React.FC<NativeTabsProps> = ({ viewProps }) => {
  return <ARNativeTabs style={{ flex: 1 }} key="native-tabs" viewProps={viewProps ?? {}} />
}
