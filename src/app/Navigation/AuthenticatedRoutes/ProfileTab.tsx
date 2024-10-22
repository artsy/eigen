import { ScreenWrapper, SharedRoutes } from "app/Navigation/AuthenticatedRoutes/SharedRoutes"
import { TabStackNavigator } from "app/Navigation/AuthenticatedRoutes/Tabs"
import { MyProfile } from "app/Scenes/MyProfile/MyProfile"

export const ProfileTab = () => {
  return (
    <TabStackNavigator.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="MyProfile"
    >
      <TabStackNavigator.Screen
        name="MyProfile"
        options={{
          headerShown: false,
        }}
        children={(props) => {
          return (
            <ScreenWrapper fullBleed>
              <MyProfile {...props} />
            </ScreenWrapper>
          )
        }}
      />

      {SharedRoutes()}
    </TabStackNavigator.Navigator>
  )
}
