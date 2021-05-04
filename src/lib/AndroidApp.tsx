import { ActionSheetProvider } from "@expo/react-native-action-sheet"
import { GlobalStore, GlobalStoreProvider } from "lib/store/GlobalStore"
import { Theme } from "palette"
import React, { useEffect } from "react"
import { UIManager, View } from "react-native"
import RNBootSplash from "react-native-bootsplash"
import track from "react-tracking"
import { RelayEnvironmentProvider } from "relay-hooks"
import { useWebViewCookies } from "./Components/ArtsyReactWebView"
import { _FancyModalPageWrapper } from "./Components/FancyModal/FancyModalContext"
import { ToastProvider } from "./Components/Toast/toastHook"
import { useSentryConfig } from "./ErrorReporting"
import { ArtsyNativeModule } from "./NativeModules/ArtsyNativeModule"
import { ModalStack } from "./navigation/ModalStack"
import { defaultEnvironment } from "./relay/createEnvironment"
import { BottomTabsNavigator } from "./Scenes/BottomTabs/BottomTabsNavigator"
import { ForceUpdate } from "./Scenes/ForceUpdate/ForceUpdate"
import { Onboarding } from "./Scenes/Onboarding/Onboarding"
import { AdminMenuWrapper } from "./utils/AdminMenuWrapper"
import { useDeepLinks } from "./utils/useDeepLinks"
import { ProvideScreenDimensions } from "./utils/useScreenDimensions"
import { useStripeConfig } from "./utils/useStripeConfig"

if (UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

const Main: React.FC<{}> = track()(({}) => {
  const isHydrated = GlobalStore.useAppState((state) => state.sessionState.isHydrated)
  const isLoggedIn = GlobalStore.useAppState((state) => !!state.auth.userAccessToken)
  const forceUpdateMessage = GlobalStore.useAppState((state) => state.config.echo.forceUpdateMessage)

  useSentryConfig()
  useStripeConfig()
  useWebViewCookies()
  useDeepLinks()

  useEffect(() => {
    if (isHydrated) {
      // We wait a bit until the UI finishes drawing behind the splash screen
      setTimeout(() => {
        RNBootSplash.hide()
        ArtsyNativeModule.setAppStyling()
        if (isLoggedIn) {
          ArtsyNativeModule.setNavigationBarColor("#FFFFFF")
          ArtsyNativeModule.setAppTheme(false)
        }
      }, 500)
    }
  }, [isHydrated])

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
    <ProvideScreenDimensions>
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
    </ProvideScreenDimensions>
  </RelayEnvironmentProvider>
)
