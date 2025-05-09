import { GoogleSignin } from "@react-native-google-signin/google-signin"
import * as Sentry from "@sentry/react-native"
import { Navigation } from "app/Navigation/Navigation"
import { GlobalStore, unsafe__getEnvironment, unsafe_getDevToggle } from "app/store/GlobalStore"
import { DevMenuWrapper } from "app/system/devTools/DevMenu/DevMenuWrapper"
import { useRageShakeDevMenu } from "app/system/devTools/useRageShakeDevMenu"
import { setupSentry } from "app/system/errorReporting/setupSentry"
import { usePurgeCacheOnAppUpdate } from "app/system/relay/usePurgeCacheOnAppUpdate"
import { addTrackingProvider } from "app/utils/track"
import {
  SEGMENT_TRACKING_PROVIDER,
  SegmentTrackingProvider,
} from "app/utils/track/SegmentTrackingProvider"
import { useAndroidAppStyling } from "app/utils/useAndroidAppStyling"
import { useDeepLinks } from "app/utils/useDeepLinks"
import { useHideSplashScreen } from "app/utils/useHideSplashScreen"
import { useIdentifyUser } from "app/utils/useIdentifyUser"
import { useSiftConfig } from "app/utils/useSiftConfig"
import { useStripeConfig } from "app/utils/useStripeConfig"
import { useEffect } from "react"
import { NativeModules, UIManager, View } from "react-native"
import { Settings } from "react-native-fbsdk-next"
import "react-native-get-random-values"
import Keys from "react-native-keys"
import { useWebViewCookies } from "./Components/ArtsyWebView"
import { Providers } from "./Providers"
import { ForceUpdate } from "./Scenes/ForceUpdate/ForceUpdate"
import { DynamicIslandStagingIndicator } from "./utils/DynamicIslandStagingIndicator"
import { createAllChannels, savePendingToken } from "./utils/PushNotification"
import { useInitializeQueryPrefetching } from "./utils/queryPrefetching"
import { ConsoleTrackingProvider } from "./utils/track/ConsoleTrackingProvider"
import { useFreshInstallTracking } from "./utils/useFreshInstallTracking"
import { useInitialNotification } from "./utils/useInitialNotification"
import { usePreferredThemeTracking } from "./utils/usePreferredThemeTracking"
import { useScreenReaderTracking } from "./utils/useScreenReaderTracking"
import useSyncNativeAuthState from "./utils/useSyncAuthState"

require("./system/ignoreLogs")

if (__DEV__) {
  // Don't open RN dev menu with shake. We use it for our own Dev Menu.
  NativeModules.DevSettings.setIsShakeToShowDevMenuEnabled(false)
}

if (__DEV__) {
  // include reactotron only on dev
  require("../../ReactotronConfig.js")
}

// Sentry must be setup early in the app lifecycle to hook into navigation
const debugSentry = unsafe_getDevToggle("DTDebugSentry")
const environment = unsafe__getEnvironment()
setupSentry({
  environment: environment.env,
  debug: debugSentry,
})

addTrackingProvider(SEGMENT_TRACKING_PROVIDER, SegmentTrackingProvider)
addTrackingProvider("console", ConsoleTrackingProvider)

if (UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

const Main = () => {
  useRageShakeDevMenu()

  useEffect(() => {
    const oss = Keys.OSS
    if (oss === "true") {
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
  const forceUpdateMessage = GlobalStore.useAppState(
    (state) => state.artsyPrefs.echo.forceUpdateMessage
  )

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
  useHideSplashScreen()
  useAndroidAppStyling()

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

  return <Navigation />
}

const InnerApp = () => {
  return (
    <Providers>
      <DevMenuWrapper>
        <Main />
      </DevMenuWrapper>

      <DynamicIslandStagingIndicator />
    </Providers>
  )
}

const SentryApp = !__DEV__ || debugSentry ? Sentry.wrap(InnerApp) : InnerApp
export const App = SentryApp
