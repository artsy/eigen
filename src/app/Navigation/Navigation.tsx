import { Flex, Text } from "@artsy/palette-mobile"
import { DefaultTheme, NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { LoadingSpinner } from "app/Components/Modals/LoadingModal"
import {
  AuthenticatedRoutes,
  AuthenticatedRoutesParams,
} from "app/Navigation/AuthenticatedRoutes/Tabs"
import {
  UnauthenticatedRoutes,
  UnauthenticatedRoutesParams,
} from "app/Navigation/UnauthenticatedRoutes"
import { GlobalStore } from "app/store/GlobalStore"
import { __unsafe_navigationRef } from "app/system/navigation/navigate"
import { useReloadedDevNavigationState } from "app/system/navigation/useReloadedDevNavigationState"

export type NavigationRoutesParams = UnauthenticatedRoutesParams & AuthenticatedRoutesParams

export const MainStackNavigator = createNativeStackNavigator<NavigationRoutesParams>()

const MODAL_NAVIGATION_STACK_STATE_KEY = "MODAL_NAVIGATION_STACK_STATE_KEY"

export const Navigation = () => {
  const { isReady, initialState, saveSession } = useReloadedDevNavigationState(
    MODAL_NAVIGATION_STACK_STATE_KEY
  )

  const isLoggedIn = GlobalStore.useAppState((state) => state.auth.userID)
  const { setSessionState: setNavigationReady } = GlobalStore.actions

  if (!isReady) {
    return <NavigationLoadingIndicator />
  }

  return (
    <NavigationContainer
      ref={__unsafe_navigationRef}
      theme={theme}
      initialState={initialState}
      onReady={() => {
        setNavigationReady({ isNavigationReady: true })
      }}
      onStateChange={(state) => {
        saveSession(state)
      }}
    >
      {!isLoggedIn && UnauthenticatedRoutes()}
      {!!isLoggedIn && AuthenticatedRoutes()}
    </NavigationContainer>
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
