import { SharedRoutes } from "app/Navigation/AuthenticatedRoutes/SharedRoutes"
import { TabStackNavigator } from "app/Navigation/AuthenticatedRoutes/Tabs"
import { HomeScreen } from "app/Navigation/_TO_BE_DELETED_Screens/HomeScreen"

export type HomeStackPrams = {
  Home: undefined
}

export const HomeTab = () => {
  return (
    <TabStackNavigator.Navigator>
      <TabStackNavigator.Screen name="Home" component={HomeScreen} />
      {SharedRoutes()}
    </TabStackNavigator.Navigator>
  )
}
