import { ActionSheetProvider } from "@expo/react-native-action-sheet"
import { GlobalStore, GlobalStoreProvider } from "lib/store/GlobalStore"
import { AdminMenuWrapper } from "lib/utils/AdminMenuWrapper"
import { addTrackingProvider, track } from "lib/utils/track"
import { SegmentTrackingProvider } from "lib/utils/track/SegmentTrackingProvider"
import { useDeepLinks } from "lib/utils/useDeepLinks"
import { ProvideScreenDimensions } from "lib/utils/useScreenDimensions"
import { useStripeConfig } from "lib/utils/useStripeConfig"
import { Theme } from "palette"
import React, { useEffect } from "react"
import { Appearance, UIManager, View } from "react-native"
import RNBootSplash from "react-native-bootsplash"
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

addTrackingProvider("segment rn android", SegmentTrackingProvider)

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
    const scheme = Appearance.getColorScheme()
    console.log("sceheme", { scheme })
    SegmentTrackingProvider.identify?.(null, {
      "user interface style": (() => {
        switch (scheme) {
          case "light":
            return "light"
          case "dark":
            return "dark"
        }
        return "unspecified"
      })(),
    })
  }, [])

  useEffect(() => {
    if (isHydrated) {
      // We wait a bit until the UI finishes drawing behind the splash screen
      setTimeout(() => {
        RNBootSplash.hide()
        ArtsyNativeModule.setAppStyling()
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
          <GlobalStoreProvider>
            <ToastProvider>
              <_FancyModalPageWrapper>
                <AdminMenuWrapper>
                  <Main />
                </AdminMenuWrapper>
              </_FancyModalPageWrapper>
            </ToastProvider>
          </GlobalStoreProvider>
        </ActionSheetProvider>
      </Theme>
    </ProvideScreenDimensions>
  </RelayEnvironmentProvider>
)
