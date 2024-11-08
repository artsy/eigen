import { modules } from "app/AppRegistry"
import { registerSharedRoutes } from "app/Navigation/AuthenticatedRoutes/SharedRoutes"
import { registerScreen, StackNavigator } from "app/Navigation/AuthenticatedRoutes/StackNavigator"

export const SearchTab: React.FC = () => {
  return (
    <StackNavigator.Navigator screenOptions={{ headerShown: false }} initialRouteName="Search">
      {registerScreen({
        name: "Search",
        module: modules["Search"],
      })}

      {registerSharedRoutes()}
    </StackNavigator.Navigator>
  )
}
