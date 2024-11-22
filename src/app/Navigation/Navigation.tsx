import { Flex, Text } from "@artsy/palette-mobile"
import { DefaultTheme, NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { addBreadcrumb } from "@sentry/react-native"
import { FPSCounter } from "app/Components/FPSCounter"
import { LoadingSpinner } from "app/Components/Modals/LoadingModal"
import {
  AuthenticatedRoutes,
  AuthenticatedRoutesParams,
} from "app/Navigation/AuthenticatedRoutes/Tabs"
import { OnboardingWelcomeScreens } from "app/Scenes/Onboarding/Onboarding"
import { GlobalStore } from "app/store/GlobalStore"
import { routingInstrumentation } from "app/system/errorReporting/setupSentry"
import { internal_navigationRef } from "app/system/navigation/navigate"
import { useReloadedDevNavigationState } from "app/system/navigation/useReloadedDevNavigationState"

import { useDevToggle } from "app/utils/hooks/useDevToggle"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { logNavigation } from "app/utils/loggers"
import { Fragment } from "react"
import { Platform } from "react-native"
import SiftReactNative from "sift-react-native"

export type NavigationRoutesParams = AuthenticatedRoutesParams

export const MainStackNavigator = createNativeStackNavigator<NavigationRoutesParams>()

const MODAL_NAVIGATION_STACK_STATE_KEY = "MODAL_NAVIGATION_STACK_STATE_KEY"

export const Navigation = () => {
  const { isReady, initialState, saveSession } = useReloadedDevNavigationState(
    MODAL_NAVIGATION_STACK_STATE_KEY
  )

  const isLoggedIn = GlobalStore.useAppState((state) => state.auth.userID)
  const fpsCounter = useDevToggle("DTFPSCounter")

  const { setSessionState: setNavigationReady } = GlobalStore.actions

  // Code for Sift tracking; needs to be manually fired on Android
  // See https://github.com/SiftScience/sift-react-native/pull/23#issuecomment-1630984250
  const enableAdditionalSiftAndroidTracking = useFeatureFlag(
    "AREnableAdditionalSiftAndroidTracking"
  )
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
          routingInstrumentation.registerNavigationContainer(internal_navigationRef)

          setNavigationReady({ isNavigationReady: true })

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

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#FFF",
  },
}

const NavigationLoadingIndicator = () => {
  return (
    <LoadingSpinner>
      {!!__DEV__ && (
        <Flex px={2} mt={2}>
          <Text color="devpurple" variant="xs" italic textAlign="center">
            This spinner is only visible in DEV mode.{"\n"}
          </Text>
        </Flex>
      )}
    </LoadingSpinner>
  )
}
