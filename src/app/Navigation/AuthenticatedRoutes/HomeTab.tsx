import { modules } from "app/AppRegistry"
import { registerSharedRoutes } from "app/Navigation/AuthenticatedRoutes/SharedRoutes"
import { registerScreen, StackNavigator } from "app/Navigation/AuthenticatedRoutes/StackNavigator"

export const HomeTab: React.FC = () => {
  return (
    <StackNavigator.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
      {registerScreen({
        name: "Home",
        module: modules["Home"],
      })}
      {registerSharedRoutes()}
    </StackNavigator.Navigator>
  )
}
