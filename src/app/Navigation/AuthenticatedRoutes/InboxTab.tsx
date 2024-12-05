import { modules } from "app/AppRegistry"
import { registerScreen, StackNavigator } from "app/Navigation/AuthenticatedRoutes/StackNavigator"
import { sharedRoutes } from "app/Navigation/AuthenticatedRoutes/sharedRoutes"

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

      {sharedRoutes()}
    </StackNavigator.Navigator>
  )
}
