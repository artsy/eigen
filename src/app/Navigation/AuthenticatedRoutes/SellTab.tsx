import { modules } from "app/AppRegistry"
import { commonRoutes } from "app/Navigation/AuthenticatedRoutes/CommonRoutes"
import { registerScreen, StackNavigator } from "app/Navigation/AuthenticatedRoutes/StackNavigator"

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
