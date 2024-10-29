import { modules } from "app/AppRegistry"
import { SharedRoutes } from "app/Navigation/AuthenticatedRoutes/SharedRoutes"
import { registerScreen, StackNavigator } from "app/Navigation/AuthenticatedRoutes/StackNavigator"

export const SearchTab = (): JSX.Element => {
  return (
    <StackNavigator.Navigator screenOptions={{ headerShown: false }} initialRouteName="Search">
      {registerScreen({
        name: "Search",
        module: modules["Search"],
      })}

      {SharedRoutes()}
    </StackNavigator.Navigator>
  )
}
