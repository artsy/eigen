import { modules } from "app/AppRegistry"
import { registerSharedRoutes } from "app/Navigation/AuthenticatedRoutes/SharedRoutes"
import { registerScreen, StackNavigator } from "app/Navigation/AuthenticatedRoutes/StackNavigator"

export const ProfileTab: React.FC = () => {
  return (
    <StackNavigator.Navigator screenOptions={{ headerShown: false }} initialRouteName="MyProfile">
      {registerScreen({
        name: "MyProfile",
        module: modules["MyProfile"],
      })}

      {registerSharedRoutes()}
    </StackNavigator.Navigator>
  )
}
