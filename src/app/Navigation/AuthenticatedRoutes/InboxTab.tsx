import { SharedRoutes } from "app/Navigation/AuthenticatedRoutes/SharedRoutes"
import { TabStackNavigator } from "app/Navigation/AuthenticatedRoutes/Tabs"

export type InboxStackPrams = {
  Inbox: undefined
}

export const InboxTab = () => {
  return (
    <TabStackNavigator.Navigator screenOptions={{ headerShown: false }} initialRouteName="Inbox">
      {SharedRoutes()}
    </TabStackNavigator.Navigator>
  )
}
