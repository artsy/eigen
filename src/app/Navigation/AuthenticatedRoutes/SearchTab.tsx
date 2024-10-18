import { SharedRoutes } from "app/Navigation/AuthenticatedRoutes/SharedRoutes"
import { TabStackNavigator } from "app/Navigation/AuthenticatedRoutes/Tabs"

export type SearchStackPrams = {
  Search: undefined
}

export const SearchTab = () => {
  return (
    <TabStackNavigator.Navigator screenOptions={{ headerShown: false }} initialRouteName="Search">
      {SharedRoutes()}
    </TabStackNavigator.Navigator>
  )
}
