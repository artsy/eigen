import { ScreenWrapper, SharedRoutes } from "app/Navigation/AuthenticatedRoutes/SharedRoutes"
import { TabStackNavigator } from "app/Navigation/AuthenticatedRoutes/Tabs"
import { HomeContainer } from "app/Scenes/Home/HomeContainer"

export type HomeStackPrams = {
  Home: undefined
}

export const HomeTab = () => {
  return (
    <TabStackNavigator.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
      <TabStackNavigator.Screen
        name="Home"
        options={{
          headerShown: false,
        }}
        children={(props) => {
          return (
            <ScreenWrapper>
              <HomeContainer {...props} />
            </ScreenWrapper>
          )
        }}
      />

      {SharedRoutes()}
    </TabStackNavigator.Navigator>
  )
}
