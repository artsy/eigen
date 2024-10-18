import { SharedRoutes } from "app/Navigation/AuthenticatedRoutes/SharedRoutes"
import { TabStackNavigator } from "app/Navigation/AuthenticatedRoutes/Tabs"

export type ProfileStackPrams = {}

export const ProfileTab = () => {
  return (
    <TabStackNavigator.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="MyProfile"
    >
      {SharedRoutes()}
    </TabStackNavigator.Navigator>
  )
}
