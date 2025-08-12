import { RegisterScreen, StackNavigator } from "app/Navigation/AuthenticatedRoutes/StackNavigator"
import { sharedRoutes } from "app/Navigation/AuthenticatedRoutes/sharedRoutes"
import { modules } from "app/Navigation/utils/modules"

export const InboxTab: React.FC = () => {
  return (
    <StackNavigator.Navigator screenOptions={{ headerShown: false }} initialRouteName="Inbox">
      <RegisterScreen name="Inbox" module={modules["Inbox"]} />
      <RegisterScreen name="Conversation" module={modules["Conversation"]} />
      {sharedRoutes()}
    </StackNavigator.Navigator>
  )
}
