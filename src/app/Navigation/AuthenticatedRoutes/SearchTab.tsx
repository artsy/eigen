import { modules } from "app/AppRegistry"
import { commonRoutes } from "app/Navigation/AuthenticatedRoutes/CommonRoutes"
import { registerScreen, StackNavigator } from "app/Navigation/AuthenticatedRoutes/StackNavigator"

export const SearchTab: React.FC = () => {
  return (
    <StackNavigator.Navigator screenOptions={{ headerShown: false }} initialRouteName="Search">
      {registerScreen({
        name: "Search",
        module: modules["Search"],
      })}

      {commonRoutes()}
    </StackNavigator.Navigator>
  )
}
