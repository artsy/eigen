import { modules } from "app/AppRegistry"
import { registerScreen, StackNavigator } from "app/Navigation/AuthenticatedRoutes/StackNavigator"
import { sharedRoutes } from "app/Navigation/AuthenticatedRoutes/sharedRoutes"

export const SearchTab: React.FC = () => {
  return (
    <StackNavigator.Navigator screenOptions={{ headerShown: false }} initialRouteName="Search">
      {registerScreen({
        name: "Search",
        module: modules["Search"],
      })}

      {sharedRoutes()}
    </StackNavigator.Navigator>
  )
}
