import { SharedRoutes } from "app/Navigation/AuthenticatedRoutes/SharedRoutes"
import { TabStackNavigator } from "app/Navigation/AuthenticatedRoutes/Tabs"

export type SellStackPrams = {
  Sell: undefined
}

export const sellRoutesLinkingConfig: Record<keyof SellStackPrams, string> = {
  Sell: "sell",
}

export const SellTab = () => {
  return (
    <TabStackNavigator.Navigator screenOptions={{ headerShown: false }} initialRouteName="Sell">
      {SharedRoutes()}
    </TabStackNavigator.Navigator>
  )
}
