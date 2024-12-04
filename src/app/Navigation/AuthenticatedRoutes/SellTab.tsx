import { modules } from "app/AppRegistry"
import { registerScreen, StackNavigator } from "app/Navigation/AuthenticatedRoutes/StackNavigator"
import { commonRoutes } from "app/Navigation/AuthenticatedRoutes/commonRoutes"

export const SellTab: React.FC = () => {
  return (
    <StackNavigator.Navigator screenOptions={{ headerShown: false }} initialRouteName="Sell">
      {registerScreen({
        name: "Sell",
        module: modules["Sell"],
      })}

      {commonRoutes()}
    </StackNavigator.Navigator>
  )
}
