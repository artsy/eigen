import { modules } from "app/AppRegistry"
import { registerScreen, StackNavigator } from "app/Navigation/AuthenticatedRoutes/StackNavigator"
import { commonRoutes } from "app/Navigation/AuthenticatedRoutes/commonRoutes"

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
