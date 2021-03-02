import { GlobalStore, GlobalStoreProvider } from "lib/store/GlobalStore"
import { Theme } from "palette"
import React, { useEffect } from "react"
import { useCallback } from "react"
import { Linking, View } from "react-native"
import track from "react-tracking"
import { RelayEnvironmentProvider } from "relay-hooks"
import { _FancyModalPageWrapper } from "./Components/FancyModal/FancyModalContext"
import { useSentryConfig } from "./ErrorReporting"
import { LogIn } from "./LogIn/LogIn"
import { ModalStack } from "./navigation/ModalStack"
import { navigate } from "./navigation/navigate"
import { defaultEnvironment } from "./relay/createEnvironment"
import { BottomTabsNavigator } from "./Scenes/BottomTabs/BottomTabsNavigator"
import { AdminMenuWrapper } from "./utils/AdminMenuWrapper"
import { ProvideScreenDimensions } from "./utils/useScreenDimensions"
import { useStripeConfig } from "./utils/useStripeConfig"

const Main: React.FC<{}> = track()(({}) => {
  const isHydrated = GlobalStore.useAppState((state) => state.sessionState.isHydrated)
  const isLoggedIn = GlobalStore.useAppState((state) => !!state.auth.userAccessToken)
  const launchURL = GlobalStore.useAppState((state) => state.auth.sessionState.url)

  const setLaunchURLAction = GlobalStore.actions.auth.setState

  useSentryConfig()
  useStripeConfig()

  useEffect(() => {
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink(url)
      }
    })
  }, [])

  useEffect(() => {
    Linking.addEventListener("url", ({ url }) => handleDeepLink(url))
    return () => {
      Linking.removeAllListeners("url")
    }
  }, [])

  const handleDeepLink = useCallback(
    (url: string) => {
      // If the state is hydrated and the user is logged in
      // We navigate them to the the deep link

      if (isHydrated && isLoggedIn) {
        navigate(url)
      }

      // Otherwise, we save the deep link url to the global store/asynchstorage
      // Then we redirect them to the login screen
      setLaunchURLAction({ sessionState: { url } })
    },
    [isHydrated, isLoggedIn]
  )

  useEffect(() => {
    if (isLoggedIn && launchURL) {
      // Navigate to the saved launch url
      navigate(launchURL)
      // Remove the launch url from the global store
      setLaunchURLAction({ sessionState: { url: null } })
    }
  }, [isLoggedIn, launchURL])

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
  <RelayEnvironmentProvider environment={defaultEnvironment}>
    <ProvideScreenDimensions>
      <Theme>
        <_FancyModalPageWrapper>
          <GlobalStoreProvider>
            <AdminMenuWrapper>
              <Main />
            </AdminMenuWrapper>
          </GlobalStoreProvider>
        </_FancyModalPageWrapper>
      </Theme>
    </ProvideScreenDimensions>
  </RelayEnvironmentProvider>
)
