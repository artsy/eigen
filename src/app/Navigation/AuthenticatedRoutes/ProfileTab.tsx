import { registerScreen, StackNavigator } from "app/Navigation/AuthenticatedRoutes/StackNavigator"
import { sharedRoutes } from "app/Navigation/AuthenticatedRoutes/sharedRoutes"
import { modules } from "app/Navigation/utils/modules"

export const ProfileTab: React.FC = () => {
  return (
    <StackNavigator.Navigator screenOptions={{ headerShown: false }} initialRouteName="MyProfile">
      {registerScreen({
        name: "MyProfile",
        module: modules["MyProfile"],
      })}
      {registerScreen({
        name: "MyCollection",
        module: modules["MyCollection"],
      })}

      {sharedRoutes()}
    </StackNavigator.Navigator>
  )
}
