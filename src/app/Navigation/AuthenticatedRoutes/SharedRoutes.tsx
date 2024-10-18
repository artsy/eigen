import { TabStackNavigator } from "app/Navigation/AuthenticatedRoutes/Tabs"
import { ArtistScreen } from "app/Navigation/_TO_BE_DELETED_Screens/ArtistScreen"
import { ArtworkScreen } from "app/Navigation/_TO_BE_DELETED_Screens/ArtworkScreen"

export type SharedRoutesParams = {
  Artwork: { artworkID: string }
  Artist: { artistID: string }
}

export const SharedRoutes = () => {
  return (
    <TabStackNavigator.Group>
      <TabStackNavigator.Screen name="Artwork" component={ArtworkScreen} />
      <TabStackNavigator.Screen name="Artist" component={ArtistScreen} />
    </TabStackNavigator.Group>
  )
}
