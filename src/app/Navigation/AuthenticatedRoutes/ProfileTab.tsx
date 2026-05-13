import { LoggedOutTabPlaceholder } from "app/Components/AuthBottomSheet/LoggedOutTabPlaceholder"
import { registerScreen, StackNavigator } from "app/Navigation/AuthenticatedRoutes/StackNavigator"
import { sharedRoutes } from "app/Navigation/AuthenticatedRoutes/sharedRoutes"
import { modules } from "app/Navigation/utils/modules"
import { GlobalStore } from "app/store/GlobalStore"

export const ProfileTab: React.FC = () => {
  const userID = GlobalStore.useAppState((state) => state.auth.userID)

  if (!userID) {
    return (
      <LoggedOutTabPlaceholder
        title="Profile"
        body="Sign up or log in to access your collection, orders, and settings."
      />
    )
  }

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
