import { modules } from "app/AppRegistry"
import { registerSharedRoutes } from "app/Navigation/AuthenticatedRoutes/SharedRoutes"
import { registerScreen, StackNavigator } from "app/Navigation/AuthenticatedRoutes/StackNavigator"

export const InboxTab: React.FC = () => {
  return (
    <StackNavigator.Navigator screenOptions={{ headerShown: false }} initialRouteName="Inbox">
      {registerScreen({
        name: "Inbox",
        module: modules["Inbox"],
      })}
      {registerScreen({
        name: "Conversation",
        module: modules["Conversation"],
      })}

      {registerSharedRoutes()}
    </StackNavigator.Navigator>
  )
}
