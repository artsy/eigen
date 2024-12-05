import { modules } from "app/AppRegistry"
import { registerScreen, StackNavigator } from "app/Navigation/AuthenticatedRoutes/StackNavigator"
import { sharedRoutes } from "app/Navigation/AuthenticatedRoutes/sharedRoutes"

export const SellTab: React.FC = () => {
  return (
    <StackNavigator.Navigator screenOptions={{ headerShown: false }} initialRouteName="Sell">
      {registerScreen({
        name: "Sell",
        module: modules["Sell"],
      })}

      {sharedRoutes()}
    </StackNavigator.Navigator>
  )
}
