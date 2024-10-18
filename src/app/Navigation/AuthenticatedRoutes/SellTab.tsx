import { SharedRoutes } from "app/Navigation/AuthenticatedRoutes/SharedRoutes"
import { TabStackNavigator } from "app/Navigation/AuthenticatedRoutes/Tabs"
import { SellScreen } from "app/Navigation/_TO_BE_DELETED_Screens/SellScreen"

export type SellStackPrams = {
  Sell: undefined
}

export const SellTab = () => {
  return (
    <TabStackNavigator.Navigator>
      <TabStackNavigator.Screen name="Sell" component={SellScreen} />
      {SharedRoutes()}
    </TabStackNavigator.Navigator>
  )
}
