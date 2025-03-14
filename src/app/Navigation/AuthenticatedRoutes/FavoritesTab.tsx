import { registerScreen, StackNavigator } from "app/Navigation/AuthenticatedRoutes/StackNavigator"
import { sharedRoutes } from "app/Navigation/AuthenticatedRoutes/sharedRoutes"
import { modules } from "app/Navigation/utils/modules"

export const FavoritesTab: React.FC = () => {
  return (
    <StackNavigator.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="FavoritesTab"
    >
      {registerScreen({
        name: "FavoritesTab",
        module: modules["FavoritesTab"],
      })}

      {sharedRoutes()}
    </StackNavigator.Navigator>
  )
}
