import { modules } from "app/AppRegistry"
import { registerScreen, StackNavigator } from "app/Navigation/AuthenticatedRoutes/StackNavigator"
import { commonRoutes } from "app/Navigation/AuthenticatedRoutes/commonRoutes"

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

      {commonRoutes()}
    </StackNavigator.Navigator>
  )
}
