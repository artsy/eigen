import { SharedRoutes } from "app/Navigation/AuthenticatedRoutes/SharedRoutes"
import { TabStackNavigator } from "app/Navigation/AuthenticatedRoutes/Tabs"
import { SearchScreen } from "app/Navigation/_TO_BE_DELETED_Screens/SearchScreen"

export type SearchStackPrams = {
  Search: undefined
}

export const SearchTab = () => {
  return (
    <TabStackNavigator.Navigator>
      <TabStackNavigator.Screen name="Search" component={SearchScreen} />
      {SharedRoutes()}
    </TabStackNavigator.Navigator>
  )
}
