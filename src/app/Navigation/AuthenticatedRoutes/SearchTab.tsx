import { modules } from "app/AppRegistry"
import { registerScreen, StackNavigator } from "app/Navigation/AuthenticatedRoutes/StackNavigator"
import { commonRoutes } from "app/Navigation/AuthenticatedRoutes/commonRoutes"

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
