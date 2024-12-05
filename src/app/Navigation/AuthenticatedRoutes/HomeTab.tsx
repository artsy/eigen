import { modules } from "app/AppRegistry"
import { registerScreen, StackNavigator } from "app/Navigation/AuthenticatedRoutes/StackNavigator"
import { sharedRoutes } from "app/Navigation/AuthenticatedRoutes/sharedRoutes"

export const HomeTab: React.FC = () => {
  return (
    <StackNavigator.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
      {registerScreen({
        name: "Home",
        module: modules["Home"],
      })}
      {sharedRoutes()}
    </StackNavigator.Navigator>
  )
}
