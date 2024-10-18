import { MainStackNavigator } from "app/Navigation/Navigation"
import { ArtworkScreen } from "app/Navigation/_TO_BE_DELETED_Screens/ArtworkScreen"
import { HomeScreen } from "app/Navigation/_TO_BE_DELETED_Screens/HomeScreen"

export type AuthenticatedRoutesParams = {
  Home: undefined
  Artwork: { artworkID: string }
}

export const AuthenticatedRoutes = () => {
  return (
    <MainStackNavigator.Group>
      <MainStackNavigator.Screen name="Home" component={HomeScreen} />
      <MainStackNavigator.Screen name="Artwork" component={ArtworkScreen} />
    </MainStackNavigator.Group>
  )
}
