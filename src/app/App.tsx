import { GoogleSignin } from "@react-native-google-signin/google-signin"
import { GlobalStore, useDevToggle } from "app/store/GlobalStore"
import { AsyncStorageDevtools } from "app/system/devTools/AsyncStorageDevTools"
import { setupFlipper } from "app/system/devTools/flipper"
import { useErrorReporting } from "app/system/errorReporting/hooks"
import { ModalStack } from "app/system/navigation/ModalStack"
import { navigate } from "app/system/navigation/navigate"
import { usePurgeCacheOnAppUpdate } from "app/system/relay/usePurgeCacheOnAppUpdate"
import { DevMenuWrapper } from "app/utils/DevMenuWrapper"
import { addTrackingProvider } from "app/utils/track"
import {
  SEGMENT_TRACKING_PROVIDER,
  SegmentTrackingProvider,
} from "app/utils/track/SegmentTrackingProvider"
import { useDeepLinks } from "app/utils/useDeepLinks"
import { useStripeConfig } from "app/utils/useStripeConfig"
import { useEffect } from "react"
import { NativeModules, Platform, UIManager, View } from "react-native"
import RNBootSplash from "react-native-bootsplash"
import Config from "react-native-config"
import { Settings } from "react-native-fbsdk-next"
import RNShake from "react-native-shake"
import { useWebViewCookies } from "./Components/ArtsyWebView"
import { FPSCounter } from "./Components/FPSCounter"
import { ArtsyNativeModule, DEFAULT_NAVIGATION_BAR_COLOR } from "./NativeModules/ArtsyNativeModule"
import { Providers } from "./Providers"
import { BottomTabsNavigator } from "./Scenes/BottomTabs/BottomTabsNavigator"
import { ForceUpdate } from "./Scenes/ForceUpdate/ForceUpdate"
import { Onboarding, __unsafe__onboardingNavigationRef } from "./Scenes/Onboarding/Onboarding"
import { DynamicIslandStagingIndicator } from "./utils/DynamicIslandStagingIndicator"
import { createAllChannels, savePendingToken } from "./utils/PushNotification"
import { useInitializeQueryPrefetching } from "./utils/queryPrefetching"
import { ConsoleTrackingProvider } from "./utils/track/ConsoleTrackingProvider"
import { useDebugging } from "./utils/useDebugging"
import { useFreshInstallTracking } from "./utils/useFreshInstallTracking"
import { useIdentifyUser } from "./utils/useIdentifyUser"
import { useInitialNotification } from "./utils/useInitialNotification"
import { usePreferredThemeTracking } from "./utils/usePreferredThemeTracking"
import { useScreenReaderTracking } from "./utils/useScreenReaderTracking"
import useSyncNativeAuthState from "./utils/useSyncAuthState"

if (__DEV__) {
  // Don't open RN dev menu with shake. We use it for our own Dev Menu.
  NativeModules.DevSettings.setIsShakeToShowDevMenuEnabled(false)
}

setupFlipper()

addTrackingProvider(SEGMENT_TRACKING_PROVIDER, SegmentTrackingProvider)
addTrackingProvider("console", ConsoleTrackingProvider)

if (UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

const useRageShakeDevMenu = () => {
  const userIsDev = GlobalStore.useAppState((s) => s.artsyPrefs.userIsDev.value)
  const isLoggedIn = GlobalStore.useAppState((state) => !!state.auth.userAccessToken)
  const isHydrated = GlobalStore.useAppState((state) => state.sessionState.isHydrated)

  useEffect(() => {
    const subscription = RNShake.addListener(() => {
      if (!userIsDev || !isHydrated) {
        return
      }

      if (!isLoggedIn) {
        __unsafe__onboardingNavigationRef.current?.navigate("DevMenu")
      } else {
        navigate("/dev-menu", { modal: true })
      }
    })

    return () => {
      subscription.remove()
    }
  }, [userIsDev, isHydrated, isLoggedIn])
}

const Main = () => {
  useRageShakeDevMenu()
  useDebugging()
  useEffect(() => {
    if (Config.OSS === "True") {
      return
    }
    GoogleSignin.configure({
      webClientId: "673710093763-hbj813nj4h3h183c4ildmu8vvqc0ek4h.apps.googleusercontent.com",
    })
    Settings.initializeSDK()
  }, [])
  const isHydrated = GlobalStore.useAppState((state) => state.sessionState.isHydrated)
  const isLoggedIn = GlobalStore.useAppState((state) => !!state.auth.userAccessToken)
  const onboardingState = GlobalStore.useAppState((state) => state.auth.onboardingState)
  const forceUpdateMessage = GlobalStore.useAppState(
    (state) => state.artsyPrefs.echo.forceUpdateMessage
  )

  const fpsCounter = useDevToggle("DTFPSCounter")

  useErrorReporting()
  useStripeConfig()
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

  if (!isHydrated) {
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

export const App = () => (
  <Providers>
    <AsyncStorageDevtools />

    <DevMenuWrapper>
      <Main />
    </DevMenuWrapper>

    <DynamicIslandStagingIndicator />
  </Providers>
)
