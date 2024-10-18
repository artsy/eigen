import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { MainStackNavigator } from "app/Navigation/Navigation"
import { LoginScreen } from "app/Navigation/_TO_BE_DELETED_Screens/LoginScreen"
import { SignUpScreen } from "app/Navigation/_TO_BE_DELETED_Screens/SignUpScreen"

export type UnauthenticatedRoutesParams = {
  Login: undefined
  SignUp: undefined
}

const UnauthenticatedStack = createNativeStackNavigator<UnauthenticatedRoutesParams>()

export const UnauthenticatedRoutes = () => {
  return (
    <UnauthenticatedStack.Navigator>
      <MainStackNavigator.Group>
        <MainStackNavigator.Screen name="Login" component={LoginScreen} />
        <MainStackNavigator.Screen name="SignUp" component={SignUpScreen} />
      </MainStackNavigator.Group>
    </UnauthenticatedStack.Navigator>
  )
}
