import { SharedRoutes } from "app/Navigation/AuthenticatedRoutes/SharedRoutes"
import { TabStackNavigator } from "app/Navigation/AuthenticatedRoutes/Tabs"
import { ProfileScreen } from "app/Navigation/_TO_BE_DELETED_Screens/ProfileScreen"

export type ProfileStackPrams = {
  Profile: undefined
}

export const ProfileTab = () => {
  return (
    <TabStackNavigator.Navigator>
      <TabStackNavigator.Screen name="Profile" component={ProfileScreen} />
      {SharedRoutes()}
    </TabStackNavigator.Navigator>
  )
}
