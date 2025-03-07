import { registerScreen, StackNavigator } from "app/Navigation/AuthenticatedRoutes/StackNavigator"
import { sharedRoutes } from "app/Navigation/AuthenticatedRoutes/sharedRoutes"
// eslint-disable-next-line no-relative-import-paths/no-relative-import-paths
import { testModules } from "../routes"

console.log("============")
export const HomeTab: React.FC = () => {
  return (
    <StackNavigator.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
      {registerScreen({
        name: "Home",
        module: testModules["Home"],
      })}
      {sharedRoutes()}
    </StackNavigator.Navigator>
  )
}
