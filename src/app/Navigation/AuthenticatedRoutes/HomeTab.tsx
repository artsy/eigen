import { SharedRoutes } from "app/Navigation/AuthenticatedRoutes/SharedRoutes"
import { TabStackNavigator } from "app/Navigation/AuthenticatedRoutes/Tabs"

export type HomeStackPrams = {
  Home: undefined
}

export const HomeTab = () => {
  return (
    <TabStackNavigator.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
      {SharedRoutes()}
    </TabStackNavigator.Navigator>
  )
}
