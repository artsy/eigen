import { GlobalStore } from "lib/store/GlobalStore"
import { AdminMenuWrapper } from "lib/utils/AdminMenuWrapper"
import { addTrackingProvider, track } from "lib/utils/track"
import { SegmentTrackingProvider } from "lib/utils/track/SegmentTrackingProvider"
import { useDeepLinks } from "lib/utils/useDeepLinks"
import { useStripeConfig } from "lib/utils/useStripeConfig"
import React, { useEffect } from "react"
import { Appearance, UIManager, View } from "react-native"
import RNBootSplash from "react-native-bootsplash"
import { AppProviders } from "./AppProviders"
import { useWebViewCookies } from "./Components/ArtsyReactWebView"
import { _FancyModalPageWrapper } from "./Components/FancyModal/FancyModalContext"
import { useSentryConfig } from "./ErrorReporting"
import { ArtsyNativeModule } from "./NativeModules/ArtsyNativeModule"
import { ModalStack } from "./navigation/ModalStack"
import { BottomTabsNavigator } from "./Scenes/BottomTabs/BottomTabsNavigator"
import { ForceUpdate } from "./Scenes/ForceUpdate/ForceUpdate"
import { Onboarding } from "./Scenes/Onboarding/Onboarding"

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
          ArtsyNativeModule.setAppLightContrast(false)
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
  <AppProviders>
    <AdminMenuWrapper>
      <Main />
    </AdminMenuWrapper>
  </AppProviders>
)
