import { RegisterScreen, StackNavigator } from "app/Navigation/AuthenticatedRoutes/StackNavigator"
import { sharedRoutes } from "app/Navigation/AuthenticatedRoutes/sharedRoutes"
import { modules } from "app/Navigation/utils/modules"

export const SearchTab: React.FC = () => {
  return (
    <StackNavigator.Navigator screenOptions={{ headerShown: false }} initialRouteName="Search">
      <RegisterScreen name="Search" module={modules["Search"]} />
      {sharedRoutes()}
    </StackNavigator.Navigator>
  )
}
