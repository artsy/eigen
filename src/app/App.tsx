import { GoogleSignin } from "@react-native-google-signin/google-signin"
import * as Sentry from "@sentry/react-native"
import { GlobalStore } from "app/store/GlobalStore"
import { codePushOptions } from "app/system/codepush"
import { AsyncStorageDevtools } from "app/system/devTools/AsyncStorageDevTools"
import { DevMenuWrapper } from "app/system/devTools/DevMenu/DevMenuWrapper"
import { setupFlipper } from "app/system/devTools/flipper"
import { useRageShakeDevMenu } from "app/system/devTools/useRageShakeDevMenu"
import { SentrySetup } from "app/system/errorReporting/Components/SentrySetup"
import { ModalStack } from "app/system/navigation/ModalStack"
import { usePurgeCacheOnAppUpdate } from "app/system/relay/usePurgeCacheOnAppUpdate"
import { useDevToggle } from "app/utils/hooks/useDevToggle"
import { addTrackingProvider } from "app/utils/track"
import {
  SEGMENT_TRACKING_PROVIDER,
  SegmentTrackingProvider,
} from "app/utils/track/SegmentTrackingProvider"
import { useDeepLinks } from "app/utils/useDeepLinks"
import { useIdentifyUser } from "app/utils/useIdentifyUser"
import { useSiftConfig } from "app/utils/useSiftConfig"
import { useStripeConfig } from "app/utils/useStripeConfig"
import { useEffect } from "react"
import { NativeModules, Platform, UIManager, View } from "react-native"
import RNBootSplash from "react-native-bootsplash"
import codePush from "react-native-code-push"
import Config from "react-native-config"
import { Settings } from "react-native-fbsdk-next"
import "react-native-get-random-values"
import { useWebViewCookies } from "./Components/ArtsyWebView"
import { FPSCounter } from "./Components/FPSCounter"
import { ArtsyNativeModule, DEFAULT_NAVIGATION_BAR_COLOR } from "./NativeModules/ArtsyNativeModule"
import { Providers } from "./Providers"
import { BottomTabsNavigator } from "./Scenes/BottomTabs/BottomTabsNavigator"
import { ForceUpdate } from "./Scenes/ForceUpdate/ForceUpdate"
import { Onboarding } from "./Scenes/Onboarding/Onboarding"
import { DynamicIslandStagingIndicator } from "./utils/DynamicIslandStagingIndicator"
import { createAllChannels, savePendingToken } from "./utils/PushNotification"
import { useInitializeQueryPrefetching } from "./utils/queryPrefetching"
import { ConsoleTrackingProvider } from "./utils/track/ConsoleTrackingProvider"
import { useFreshInstallTracking } from "./utils/useFreshInstallTracking"
import { useInitialNotification } from "./utils/useInitialNotification"
import { usePreferredThemeTracking } from "./utils/usePreferredThemeTracking"
import { useScreenReaderTracking } from "./utils/useScreenReaderTracking"
import useSyncNativeAuthState from "./utils/useSyncAuthState"

if (__DEV__) {
  // Don't open RN dev menu with shake. We use it for our own Dev Menu.
  NativeModules.DevSettings.setIsShakeToShowDevMenuEnabled(false)
}

if (__DEV__) {
  // include reactotron only on dev
  require("../../ReactotronConfig.js")
}

setupFlipper()

addTrackingProvider(SEGMENT_TRACKING_PROVIDER, SegmentTrackingProvider)
addTrackingProvider("console", ConsoleTrackingProvider)

if (UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

const Main = () => {
  useRageShakeDevMenu()
  useEffect(() => {
    if (Config.OSS === "true") {
      return
    }
    GoogleSignin.configure({
      webClientId: "673710093763-hbj813nj4h3h183c4ildmu8vvqc0ek4h.apps.googleusercontent.com",
    })
    Settings.initializeSDK()
  }, [])
  const isHydrated = GlobalStore.useAppState((state) => state.sessionState.isHydrated)
  const isUserIdentified = GlobalStore.useAppState(
    (state) => state.auth.sessionState.isUserIdentified
  )

  const isLoggedIn = GlobalStore.useAppState((state) => !!state.auth.userAccessToken)
  const onboardingState = GlobalStore.useAppState((state) => state.auth.onboardingState)
  const forceUpdateMessage = GlobalStore.useAppState(
    (state) => state.artsyPrefs.echo.forceUpdateMessage
  )

  const fpsCounter = useDevToggle("DTFPSCounter")

  useStripeConfig()
  useSiftConfig()
  useWebViewCookies()
  useDeepLinks()
  useInitialNotification()
  useInitializeQueryPrefetching()
  useIdentifyUser()
  useSyncNativeAuthState()

  useEffect(() => {
    createAllChannels()
  }, [])
  usePreferredThemeTracking()
  useScreenReaderTracking()
  useFreshInstallTracking()
  usePurgeCacheOnAppUpdate()

  useEffect(() => {
    if (isHydrated) {
      // We wait a bit until the UI finishes drawing behind the splash screen
      setTimeout(() => {
        if (Platform.OS === "android") {
          RNBootSplash.hide().then(() => {
            requestAnimationFrame(() => {
              ArtsyNativeModule.lockActivityScreenOrientation()
            })
          })
        }
        if (Platform.OS === "android") {
          ArtsyNativeModule.setAppStyling()
        }
        if (isLoggedIn && Platform.OS === "android") {
          ArtsyNativeModule.setNavigationBarColor(DEFAULT_NAVIGATION_BAR_COLOR)
          ArtsyNativeModule.setAppLightContrast(false)
        }
      }, 500)
    }
  }, [isHydrated])

  useEffect(() => {
    if (isLoggedIn) {
      savePendingToken()
    }
  }, [isLoggedIn])

  if (!isHydrated || !isUserIdentified) {
    return <View />
  }

  if (forceUpdateMessage) {
    return <ForceUpdate forceUpdateMessage={forceUpdateMessage} />
  }

  if (!isLoggedIn || onboardingState === "incomplete") {
    return <Onboarding />
  }

  return (
    <ModalStack>
      <BottomTabsNavigator />
      {!!fpsCounter && <FPSCounter />}
    </ModalStack>
  )
}

const InnerApp = () => (
  <Providers>
    <AsyncStorageDevtools />
    <SentrySetup />

    <DevMenuWrapper>
      <Main />
    </DevMenuWrapper>

    <DynamicIslandStagingIndicator />
  </Providers>
)

const SentryApp = Sentry.wrap(InnerApp)
export const App = codePush(codePushOptions)(SentryApp)
