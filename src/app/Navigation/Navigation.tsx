import { Flex, Spacer, Spinner, Text } from "@artsy/palette-mobile"
import { useLogger } from "@react-navigation/devtools"
import { NavigationContainer, NavigationContainerRef } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useReactNavigationDevTools } from "@rozenite/react-navigation-plugin"
import { addBreadcrumb } from "@sentry/react-native"
import { FPSCounter } from "app/Components/FPSCounter"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import {
  AuthenticatedRoutes,
  AuthenticatedRoutesParams,
} from "app/Navigation/AuthenticatedRoutes/Tabs"
import { useNavigationTheme } from "app/Navigation/useNavigationTheme"
import { OnboardingWelcomeScreens } from "app/Scenes/Onboarding/Onboarding"
import { GlobalStore } from "app/store/GlobalStore"
import { navigationInstrumentation } from "app/system/errorReporting/setupSentry"
import { useReloadedDevNavigationState } from "app/system/navigation/useReloadedDevNavigationState"
import { useDevToggle } from "app/utils/hooks/useDevToggle"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { logNavigation } from "app/utils/loggers"
import { Fragment } from "react"
import { Platform } from "react-native"
import SiftReactNative from "sift-react-native"

export const internal_navigationRef = { current: null as NavigationContainerRef<any> | null }

export type NavigationRoutesParams = AuthenticatedRoutesParams

export const MainStackNavigator = createNativeStackNavigator<NavigationRoutesParams>()

const MODAL_NAVIGATION_STACK_STATE_KEY = "MODAL_NAVIGATION_STACK_STATE_KEY"

export const Navigation = () => {
  const { isReady, initialState, saveSession } = useReloadedDevNavigationState(
    MODAL_NAVIGATION_STACK_STATE_KEY
  )

  useReactNavigationDevTools({ ref: internal_navigationRef })

  const isLoggedIn = GlobalStore.useAppState((state) => state.auth.userID)
  const fpsCounter = useDevToggle("DTFPSCounter")

  const theme = useNavigationTheme()

  const { setSessionState: setNavigationReady } = GlobalStore.actions

  // Code for Sift tracking; needs to be manually fired on Android
  // See https://github.com/SiftScience/sift-react-native/pull/23#issuecomment-1630984250
  const enableAdditionalSiftAndroidTracking = useFeatureFlag(
    "AREnableAdditionalSiftAndroidTracking"
  )

  if (__DEV__) {
    // It's safe to break the rul of hooks here because we are only using it in dev
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useLogger(internal_navigationRef)
  }

  if (!isReady) {
    return <NavigationLoadingIndicator />
  }

  const trackSiftAndroid = Platform.OS === "android" && enableAdditionalSiftAndroidTracking

  return (
    <Fragment>
      <NavigationContainer
        ref={internal_navigationRef}
        theme={theme}
        initialState={initialState}
        onReady={() => {
          navigationInstrumentation.registerNavigationContainer(internal_navigationRef)

          setNavigationReady({ isNavigationReady: true })
          LegacyNativeModules.ARNotificationsManager.didFinishBootstrapping()

          if (trackSiftAndroid) {
            const initialRouteName = internal_navigationRef?.current?.getCurrentRoute()?.name
            SiftReactNative.setPageName(`screen_${initialRouteName}`)
            SiftReactNative.upload()
          }
        }}
        onStateChange={(state) => {
          saveSession(state)

          const currentRoute = internal_navigationRef?.current?.getCurrentRoute()
          const params = currentRoute?.params

          if (__DEV__ && logNavigation) {
            console.log(
              `navigated to ${currentRoute?.name} ${
                currentRoute?.params ? JSON.stringify(currentRoute.params) : ""
              } `
            )
          }

          if (currentRoute && Platform.OS === "ios") {
            LegacyNativeModules.ARTDeeplinkTimeoutModule.invalidateDeeplinkTimeout()
          }

          addBreadcrumb({
            message: `navigated to ${currentRoute?.name}`,
            category: "navigation",
            data: { ...params },
            level: "info",
          })

          if (trackSiftAndroid) {
            SiftReactNative.setPageName(`screen_${currentRoute?.name}`)
            SiftReactNative.upload()
          }
        }}
      >
        {!isLoggedIn && <OnboardingWelcomeScreens />}
        {!!isLoggedIn && <AuthenticatedRoutes />}
      </NavigationContainer>
      {!!fpsCounter && <FPSCounter style={{ bottom: Platform.OS === "ios" ? 40 : undefined }} />}
    </Fragment>
  )
}

const NavigationLoadingIndicator = () => {
  return (
    <Flex backgroundColor="mono0" flex={1} justifyContent="center">
      {!!__DEV__ && (
        <Flex px={2} mt={2} backgroundColor="mono0" alignItems="center">
          <Spinner color="devpurple" size="large" />
          <Spacer y={4} />
          <Text color="mono100" variant="xs" textAlign="center">
            Reloading previous navigation state
          </Text>
        </Flex>
      )}
    </Flex>
  )
}
