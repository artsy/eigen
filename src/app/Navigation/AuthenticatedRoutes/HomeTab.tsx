import { modules } from "app/AppRegistry"
import { commonRoutes } from "app/Navigation/AuthenticatedRoutes/CommonRoutes"
import { registerScreen, StackNavigator } from "app/Navigation/AuthenticatedRoutes/StackNavigator"

export const HomeTab: React.FC = () => {
  return (
    <StackNavigator.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
      {registerScreen({
        name: "Home",
        module: modules["Home"],
      })}
      {commonRoutes()}
    </StackNavigator.Navigator>
  )
}
