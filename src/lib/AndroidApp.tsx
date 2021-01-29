import { GlobalStore, GlobalStoreProvider } from "lib/store/GlobalStore"
import { Theme } from "palette"
import React from "react"
import { View } from "react-native"
import track from "react-tracking"
import { LogIn } from "./LogIn/LogIn"
import { ModalStack } from "./navigation/ModalStack"
import { BottomTabsNavigator } from "./Scenes/BottomTabs/BottomTabsNavigator"
import { AdminMenuWrapper } from "./utils/AdminMenuWrapper"
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

  return (
    <ModalStack>
      <BottomTabsNavigator></BottomTabsNavigator>
    </ModalStack>
  )
})

export const App = () => (
  <View style={{ flex: 1 }}>
    <ProvideScreenDimensions>
      <Theme>
        <GlobalStoreProvider>
          <AdminMenuWrapper>
            <Main />
          </AdminMenuWrapper>
        </GlobalStoreProvider>
      </Theme>
    </ProvideScreenDimensions>
  </View>
)
