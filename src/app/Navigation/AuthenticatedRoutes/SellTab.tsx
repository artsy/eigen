import { ScreenWrapper, SharedRoutes } from "app/Navigation/AuthenticatedRoutes/SharedRoutes"
import { TabStackNavigator } from "app/Navigation/AuthenticatedRoutes/Tabs"
import { SellWithArtsy } from "app/Scenes/SellWithArtsy/SubmitArtwork/UploadPhotos/utils"

export type SellStackPrams = {
  Sell: undefined
}

export const sellRoutesLinkingConfig: Record<keyof SellStackPrams, string> = {
  Sell: "sell",
}

export const SellTab = () => {
  return (
    <TabStackNavigator.Navigator screenOptions={{ headerShown: false }} initialRouteName="Sell">
      <TabStackNavigator.Screen
        name="Sell"
        options={{
          headerShown: false,
        }}
        children={(props) => {
          return (
            <ScreenWrapper>
              <SellWithArtsy {...props} />
            </ScreenWrapper>
          )
        }}
      />

      {SharedRoutes()}
    </TabStackNavigator.Navigator>
  )
}
