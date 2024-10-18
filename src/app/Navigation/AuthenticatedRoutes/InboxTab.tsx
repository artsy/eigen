import { SharedRoutes } from "app/Navigation/AuthenticatedRoutes/SharedRoutes"
import { TabStackNavigator } from "app/Navigation/AuthenticatedRoutes/Tabs"
import { InboxScreen } from "app/Navigation/_TO_BE_DELETED_Screens/InboxScreen"

export type InboxStackPrams = {
  Inbox: undefined
}

export const InboxTab = () => {
  return (
    <TabStackNavigator.Navigator>
      <TabStackNavigator.Screen name="Inbox" component={InboxScreen} />
      {SharedRoutes()}
    </TabStackNavigator.Navigator>
  )
}
