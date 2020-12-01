import { NavigationContainer } from "@react-navigation/native"
import { LogIn } from "lib/LogIn/LogIn"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { BottomTabsNavigator } from "lib/Scenes/BottomTabs/BottomTabsNavigator"
import "lib/store/GlobalStore"
import { GlobalStore, GlobalStoreProvider } from "lib/store/GlobalStore"
import { ProvideScreenDimensions } from "lib/utils/useScreenDimensions"
import { Theme } from "palette"
import React from "react"
import { AppRegistry, View } from "react-native"
import track from "react-tracking"
import { RelayEnvironmentProvider } from "relay-hooks"

const AndroidRoot: React.FC<{}> = ({}) => {
  return (
    <Theme>
      <RelayEnvironmentProvider environment={defaultEnvironment}>
        <ProvideScreenDimensions>
          <GlobalStoreProvider>
            <NavigationContainer>
              <Main />
            </NavigationContainer>
          </GlobalStoreProvider>
        </ProvideScreenDimensions>
      </RelayEnvironmentProvider>
    </Theme>
  )
}

AppRegistry.registerComponent("Artsy", () => AndroidRoot)

const Main: React.FC<{}> = track()(({}) => {
  const isHydrated = GlobalStore.useAppState((state) => state.sessionState.isHydrated)
  const isLoggedIn = GlobalStore.useAppState((state) => !!state.auth.userAccessToken)

  if (!isHydrated) {
    return <View></View>
  }
  if (!isLoggedIn) {
    return <LogIn></LogIn>
  }
  return <BottomTabsNavigator />
})
