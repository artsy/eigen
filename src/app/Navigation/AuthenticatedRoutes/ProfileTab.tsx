import { modules } from "app/AppRegistry"
import { commonRoutes } from "app/Navigation/AuthenticatedRoutes/CommonRoutes"
import { registerScreen, StackNavigator } from "app/Navigation/AuthenticatedRoutes/StackNavigator"

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
