import { modules } from "app/AppRegistry"
import { registerSharedRoutes } from "app/Navigation/AuthenticatedRoutes/SharedRoutes"
import { registerScreen, StackNavigator } from "app/Navigation/AuthenticatedRoutes/StackNavigator"

export const SellTab: React.FC = () => {
  return (
    <StackNavigator.Navigator screenOptions={{ headerShown: false }} initialRouteName="Sell">
      {registerScreen({
        name: "Sell",
        module: modules["Sell"],
      })}

      {registerSharedRoutes()}
    </StackNavigator.Navigator>
  )
}
