import { RouteProp } from "@react-navigation/native"
import { CityGuideView } from "app/NativeModules/CityGuideView"
import { StackNav } from "app/Navigation"
import { ArtistQueryRenderer } from "app/Scenes/Artist/Artist"
import { ArtistSeriesQueryRenderer } from "app/Scenes/ArtistSeries/ArtistSeries"
import { PartnerQueryRenderer } from "app/Scenes/Partner/Partner"
import { SearchScreen } from "app/Scenes/Search/Search"
import { NewNavComponentWrapper } from "app/system/newNavigation/NewNavComponentWrapper"

export type SearchRoutes = {
  Search: undefined
  Artist: { artistID: string } // TODO: probably doesn't belong here
  Partner: { partnerID: string }
  ArtistSeries: { artistSeriesID: string }
  LocalDiscovery: undefined
}

type ArtistSeriesRouteParams = {
  ArtistSeries: {
    artistSeriesID: string
  }
}

type ArtistSeriesWrapperProps = {
  route: RouteProp<ArtistSeriesRouteParams, "ArtistSeries">
}

const ArtistSeriesWrapper: React.FC<ArtistSeriesWrapperProps> = ({ route }) => {
  return (
    <NewNavComponentWrapper route={route}>
      <ArtistSeriesQueryRenderer artistSeriesID={route.params.artistSeriesID} />
    </NewNavComponentWrapper>
  )
}

export const SearchRouter = () => {
  return (
    <StackNav.Group>
      <StackNav.Screen name="Search" component={SearchScreen} />
      <StackNav.Screen name="Artist" component={ArtistQueryRenderer} />
      <StackNav.Screen name="Partner" component={PartnerQueryRenderer} />
      <StackNav.Screen name="ArtistSeries" component={ArtistSeriesWrapper} />
      <StackNav.Screen name="LocalDiscovery" component={CityGuideView} />
    </StackNav.Group>
  )
}
