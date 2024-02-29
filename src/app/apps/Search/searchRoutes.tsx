import { StackNav } from "app/Navigation"
import { Artist, ArtistQueryRenderer } from "app/Scenes/Artist/Artist"
import { SearchScreen } from "app/Scenes/Search/Search"

export type SearchRoutes = {
  Search: undefined
  Artist: { artistID: string } // TODO: probably doesn't belong here
}

export const SearchRouter = () => {
  return (
    <StackNav.Group>
      <StackNav.Screen name="Search" component={SearchScreen} />
      <StackNav.Screen name="Artist" component={ArtistQueryRenderer} />
    </StackNav.Group>
  )
}
