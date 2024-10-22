import { ScreenWrapper, SharedRoutes } from "app/Navigation/AuthenticatedRoutes/SharedRoutes"
import { TabStackNavigator } from "app/Navigation/AuthenticatedRoutes/Tabs"
import { SearchScreen } from "app/Scenes/Search/Search"

export const SearchTab = () => {
  return (
    <TabStackNavigator.Navigator screenOptions={{ headerShown: false }} initialRouteName="Search">
      <TabStackNavigator.Screen
        name="Search"
        options={{
          headerShown: false,
        }}
        children={(props) => {
          return (
            <ScreenWrapper>
              <SearchScreen {...props} />
            </ScreenWrapper>
          )
        }}
      />

      {SharedRoutes()}
    </TabStackNavigator.Navigator>
  )
}
