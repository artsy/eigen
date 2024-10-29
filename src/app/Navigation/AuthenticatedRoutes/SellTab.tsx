import { modules } from "app/AppRegistry"
import { SharedRoutes } from "app/Navigation/AuthenticatedRoutes/SharedRoutes"
import { registerScreen, StackNavigator } from "app/Navigation/AuthenticatedRoutes/StackNavigator"

export const SellTab = (): JSX.Element => {
  return (
    <StackNavigator.Navigator screenOptions={{ headerShown: false }} initialRouteName="Sell">
      {registerScreen({
        name: "Sell",
        module: modules["Sell"],
      })}

      {SharedRoutes()}
    </StackNavigator.Navigator>
  )
}
