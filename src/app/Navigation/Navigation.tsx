import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { AuthenticatedRoutes, AuthenticatedRoutesParams } from "app/Navigation/AuthenticatedRoutes"
import {
  UnauthenticatedRoutes,
  UnauthenticatedRoutesParams,
} from "app/Navigation/UnauthenticatedRoutes"
import { GlobalStore } from "app/store/GlobalStore"

export type NavigationRoutesParams = UnauthenticatedRoutesParams & AuthenticatedRoutesParams

export const MainStackNavigator = createNativeStackNavigator<NavigationRoutesParams>()

export const Navigation = () => {
  const isLoggedIn = GlobalStore.useAppState((state) => state.auth.userID)

  return (
    <NavigationContainer>
      <MainStackNavigator.Navigator>
        {!isLoggedIn && UnauthenticatedRoutes()}
        {!!isLoggedIn && AuthenticatedRoutes()}
      </MainStackNavigator.Navigator>
    </NavigationContainer>
  )
}
