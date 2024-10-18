import { MainStackNavigator } from "app/Navigation/Navigation"
import { LoginScreen } from "app/Navigation/_TO_BE_DELETED_Screens/LoginScreen"
import { SignUpScreen } from "app/Navigation/_TO_BE_DELETED_Screens/SignUpScreen"

export type UnauthenticatedRoutesParams = {
  Login: undefined
  SignUp: undefined
}

export const UnauthenticatedRoutes = () => {
  return (
    <MainStackNavigator.Group>
      <MainStackNavigator.Screen name="Login" component={LoginScreen} />
      <MainStackNavigator.Screen name="SignUp" component={SignUpScreen} />
    </MainStackNavigator.Group>
  )
}
