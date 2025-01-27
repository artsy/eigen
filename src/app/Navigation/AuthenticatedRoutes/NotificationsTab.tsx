import { registerScreen, StackNavigator } from "app/Navigation/AuthenticatedRoutes/StackNavigator"
import { sharedRoutes } from "app/Navigation/AuthenticatedRoutes/sharedRoutes"
import { modules } from "app/Navigation/utils/modules"

export const NotificationsTab: React.FC = () => {
  return (
    <StackNavigator.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Notifications"
    >
      {registerScreen({
        name: "Notifications",
        module: modules["Notifications"],
      })}

      {sharedRoutes()}
    </StackNavigator.Navigator>
  )
}
