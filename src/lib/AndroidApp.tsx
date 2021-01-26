import AsyncStorage from "@react-native-community/async-storage"
import { GlobalStore, GlobalStoreProvider } from "lib/store/GlobalStore"
import { Theme } from "palette"
import React from "react"
import { View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import track from "react-tracking"
import { LogIn } from "./LogIn/LogIn"
import { BottomTabsNavigator } from "./Scenes/BottomTabs/BottomTabsNavigator"
import { ProvideScreenDimensions } from "./utils/useScreenDimensions"

const Main: React.FC<{}> = track()(({}) => {
  const isHydrated = GlobalStore.useAppState((state) => state.sessionState.isHydrated)
  const isLoggedIn = GlobalStore.useAppState((state) => !!state.auth.userAccessToken)

  if (!isHydrated) {
    return <View></View>
  }
  if (!isLoggedIn) {
    return <LogIn></LogIn>
  }

  return <BottomTabsNavigator></BottomTabsNavigator>
})

export const App = () => (
  <View style={{ flex: 1 }}>
    <ProvideScreenDimensions>
      <Theme>
        <GlobalStoreProvider>
          <Main />
        </GlobalStoreProvider>
      </Theme>
    </ProvideScreenDimensions>
    <View style={{ position: "absolute", bottom: 0, left: 0 }}>
      <TouchableOpacity
        onPress={() => {
          console.warn("deleting everything")
          AsyncStorage.clear()
        }}
      >
        <View style={{ width: 5, height: 5, backgroundColor: "red" }}></View>
      </TouchableOpacity>
    </View>
  </View>
)
