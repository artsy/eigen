import { DefaultTheme, NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
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

export type NavigationRoutesParams = UnauthenticatedRoutesParams & AuthenticatedRoutesParams

export const MainStackNavigator = createNativeStackNavigator<NavigationRoutesParams>()

export const Navigation = () => {
  const isLoggedIn = GlobalStore.useAppState((state) => state.auth.userID)

  return (
    <NavigationContainer ref={__unsafe_navigationRef} theme={theme}>
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
