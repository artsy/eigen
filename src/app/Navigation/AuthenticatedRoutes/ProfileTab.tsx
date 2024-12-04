import { modules } from "app/AppRegistry"
import { registerScreen, StackNavigator } from "app/Navigation/AuthenticatedRoutes/StackNavigator"
import { commonRoutes } from "app/Navigation/AuthenticatedRoutes/commonRoutes"

export const ProfileTab: React.FC = () => {
  return (
    <StackNavigator.Navigator screenOptions={{ headerShown: false }} initialRouteName="MyProfile">
      {registerScreen({
        name: "MyProfile",
        module: modules["MyProfile"],
      })}

      {commonRoutes()}
    </StackNavigator.Navigator>
  )
}
