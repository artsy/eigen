import { GlobalStore, GlobalStoreProvider } from "lib/store/GlobalStore"
import { Theme } from "palette"
import React, { useEffect } from "react"
import { Linking, View } from "react-native"
import track from "react-tracking"
import { _FancyModalPageWrapper } from "./Components/FancyModal/FancyModalContext"
import { LogIn } from "./LogIn/LogIn"
import { ModalStack } from "./navigation/ModalStack"
import { navigate } from "./navigation/navigate"
import { BottomTabsNavigator } from "./Scenes/BottomTabs/BottomTabsNavigator"
import { AdminMenuWrapper } from "./utils/AdminMenuWrapper"
import { ProvideScreenDimensions } from "./utils/useScreenDimensions"

const Main: React.FC<{}> = track()(({}) => {
  const isHydrated = GlobalStore.useAppState((state) => state.sessionState.isHydrated)
  const isLoggedIn = GlobalStore.useAppState((state) => !!state.auth.userAccessToken)

  useEffect(() => {
    // TODO: handle opening the app from deep link (Linking.getInitialURL)
    Linking.addEventListener("url", ({ url }) => navigate(url))
    return () => {
      Linking.removeAllListeners("url")
    }
  }, [])

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
  <ProvideScreenDimensions>
    <Theme>
      <GlobalStoreProvider>
        <_FancyModalPageWrapper>
          <AdminMenuWrapper>
            <Main />
          </AdminMenuWrapper>
        </_FancyModalPageWrapper>
      </GlobalStoreProvider>
    </Theme>
  </ProvideScreenDimensions>
)
