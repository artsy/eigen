import { InboxQueryRenderer } from "app/Components/Containers/Inbox"
import { ScreenWrapper, SharedRoutes } from "app/Navigation/AuthenticatedRoutes/SharedRoutes"
import { TabStackNavigator } from "app/Navigation/AuthenticatedRoutes/Tabs"

export const InboxTab = (): JSX.Element => {
  return (
    <TabStackNavigator.Navigator screenOptions={{ headerShown: false }} initialRouteName="Inbox">
      <TabStackNavigator.Screen
        name="Inbox"
        options={{
          headerShown: false,
        }}
        children={(props) => {
          return (
            <ScreenWrapper>
              <InboxQueryRenderer {...props} />
            </ScreenWrapper>
          )
        }}
      />

      {SharedRoutes()}
    </TabStackNavigator.Navigator>
  )
}
