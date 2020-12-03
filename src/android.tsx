import { LogIn } from "lib/LogIn/LogIn"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { BottomTabsNavigator } from "lib/Scenes/BottomTabs/BottomTabsNavigator"
import "lib/store/GlobalStore"
import { GlobalStore, GlobalStoreProvider } from "lib/store/GlobalStore"
import { ProvideScreenDimensions } from "lib/utils/useScreenDimensions"
import { Theme } from "palette"
import React from "react"
import { AppRegistry, LogBox, View } from "react-native"
import track from "react-tracking"
import { RelayEnvironmentProvider } from "relay-hooks"

const AndroidRoot: React.FC<{}> = ({}) => {
  return (
    <Theme>
      <RelayEnvironmentProvider environment={defaultEnvironment}>
        <ProvideScreenDimensions>
          <GlobalStoreProvider>
            <Main />
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

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
  "Calling `getNode()` on the ref of an Animated component is no longer necessary.",
  "RelayResponseNormalizer: Payload did not contain a value for field `id: id`. Check that you are parsing with the same query that was used to fetch the payload.",

  // RN 0.59.0 ships with this bug, see: https://github.com/facebook/react-native/issues/16376
  "RCTBridge required dispatch_sync to load RCTDevLoadingView. This may lead to deadlocks",

  // The following item exist in node_modules. Once this PR is merged, to make warnings opt-in, we can ignore: https://github.com/facebook/metro/issues/287

  // RN 0.59.0 ships with this issue, which has been effectively marked as #wontfix: https://github.com/facebook/react-native/issues/23130
  "Require cycle: node_modules/react-native/Libraries/Network/fetch.js -> node_modules/react-native/Libraries/vendor/core/whatwg-fetch.js -> node_modules/react-native/Libraries/Network/fetch.js",

  "Require cycle: src/lib/store/GlobalStore.tsx",

  // This is for the Artist page, which will likely get redone soon anyway.
  "VirtualizedLists should never be nested inside plain ScrollViews with the same orientation - use another VirtualizedList-backed container instead.",
])
