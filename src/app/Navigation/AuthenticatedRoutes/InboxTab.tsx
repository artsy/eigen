import { LoggedOutTabPlaceholder } from "app/Components/AuthBottomSheet/LoggedOutTabPlaceholder"
import { registerScreen, StackNavigator } from "app/Navigation/AuthenticatedRoutes/StackNavigator"
import { sharedRoutes } from "app/Navigation/AuthenticatedRoutes/sharedRoutes"
import { modules } from "app/Navigation/utils/modules"
import { GlobalStore } from "app/store/GlobalStore"

export const InboxTab: React.FC = () => {
  const userID = GlobalStore.useAppState((state) => state.auth.userID)

  if (!userID) {
    return (
      <LoggedOutTabPlaceholder
        title="Inbox"
        body="Sign up or log in to message galleries and track your orders."
      />
    )
  }

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
