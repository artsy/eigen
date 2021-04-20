import { ActionSheetProvider } from "@expo/react-native-action-sheet"
import { GlobalStore, GlobalStoreProvider } from "lib/store/GlobalStore"
import { Theme } from "palette"
import React, { useEffect, useRef } from "react"
import { useCallback } from "react"
import { Linking, UIManager, View } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import track from "react-tracking"
import { RelayEnvironmentProvider } from "relay-hooks"
import { useWebViewCookies } from "./Components/ArtsyReactWebView"
import { _FancyModalPageWrapper } from "./Components/FancyModal/FancyModalContext"
import { ToastProvider } from "./Components/Toast/toastHook"
import { useSentryConfig } from "./ErrorReporting"
import { ModalStack } from "./navigation/ModalStack"
import { navigate } from "./navigation/navigate"
import { defaultEnvironment } from "./relay/createEnvironment"
import { BottomTabsNavigator } from "./Scenes/BottomTabs/BottomTabsNavigator"
import { ForceUpdate } from "./Scenes/ForceUpdate/ForceUpdate"
import { Onboarding } from "./Scenes/Onboarding/Onboarding"
import { AdminMenuWrapper } from "./utils/AdminMenuWrapper"
import { useStripeConfig } from "./utils/useStripeConfig"

import RNBootSplash from "react-native-bootsplash"
import { ArtsyNativeModule } from "./NativeModules/ArtsyNativeModule"

if (UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

const Main: React.FC<{}> = track()(({}) => {
  const isHydrated = GlobalStore.useAppState((state) => state.sessionState.isHydrated)
  const isLoggedIn = GlobalStore.useAppState((state) => !!state.auth.userAccessToken)
  const launchURL = useRef<string | null>(null)
  const forceUpdateMessage = GlobalStore.useAppState((state) => state.config.echo.forceUpdateMessage)

  useSentryConfig()
  useStripeConfig()
  useWebViewCookies()

  useEffect(() => {
    if (isHydrated) {
      // We wait a bit until the UI finishes drawing behind the splash screen
      setTimeout(() => {
        RNBootSplash.hide()
        ArtsyNativeModule.setAppStyling()
      }, 500)
    }
  }, [isHydrated])

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

      // Otherwise, we save the deep link url
      // to redirect them to the login screen once they log in
      launchURL.current = url
    },
    [isHydrated, isLoggedIn]
  )

  useEffect(() => {
    if (isLoggedIn && launchURL.current) {
      // Navigate to the saved launch url
      navigate(launchURL.current)
      // Reset the launchURL
      launchURL.current = null
    }
  }, [isLoggedIn, launchURL.current])

  if (!isHydrated) {
    return <View></View>
  }

  if (forceUpdateMessage) {
    return <ForceUpdate forceUpdateMessage={forceUpdateMessage} />
  }

  if (!isLoggedIn) {
    return <Onboarding />
  }

  return (
    <ModalStack>
      <BottomTabsNavigator />
    </ModalStack>
  )
})

export const App = () => (
  <RelayEnvironmentProvider environment={defaultEnvironment}>
    <SafeAreaProvider>
      <Theme>
        <ActionSheetProvider>
          <ToastProvider>
            <_FancyModalPageWrapper>
              <GlobalStoreProvider>
                <AdminMenuWrapper>
                  <Main />
                </AdminMenuWrapper>
              </GlobalStoreProvider>
            </_FancyModalPageWrapper>
          </ToastProvider>
        </ActionSheetProvider>
      </Theme>
    </SafeAreaProvider>
  </RelayEnvironmentProvider>
)
