import { modules } from "app/AppRegistry"
import { registerScreen, StackNavigator } from "app/Navigation/AuthenticatedRoutes/StackNavigator"
import { sharedRoutes } from "app/Navigation/AuthenticatedRoutes/sharedRoutes"

export const ProfileTab: React.FC = () => {
  return (
    <StackNavigator.Navigator screenOptions={{ headerShown: false }} initialRouteName="MyProfile">
      {registerScreen({
        name: "MyProfile",
        module: modules["MyProfile"],
      })}

      {sharedRoutes()}
    </StackNavigator.Navigator>
  )
}
