import { RouteProp } from "@react-navigation/native"
import { CityGuideView } from "app/NativeModules/CityGuideView"
import { StackNav } from "app/Navigation"
import { ArtistQueryRenderer } from "app/Scenes/Artist/Artist"
import { ArtistSeriesQueryRenderer } from "app/Scenes/ArtistSeries/ArtistSeries"
import { ArtworkPageableScreen } from "app/Scenes/Artwork/Artwork"
import { CollectionQueryRenderer } from "app/Scenes/Collection/Collection"
import { PartnerQueryRenderer } from "app/Scenes/Partner/Partner"
import { SearchScreen } from "app/Scenes/Search/Search"
import { NewNavComponentWrapper } from "app/system/newNavigation/NewNavComponentWrapper"

export type SearchRoutes = {
  Search: undefined
  Artist: { artistID: string } // TODO: some of these probably don't belong here
  Artwork: { artworkID: string }
  Partner: { partnerID: string }
  ArtistSeries: { artistSeriesID: string }
  Collection: { collectionID: string }
  LocalDiscovery: undefined
}

// TODO: These don't belong here, wrapper components POC, probably
// belong colocated with the components they wrap / if we migrate to updated
// folder structure with apps directory should be put in respective app
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

type ArtworkRouteParams = {
  Artwork: {
    artworkID: string
  }
}

type ArtworkWrapperProps = {
  route: RouteProp<ArtworkRouteParams, "Artwork">
}

// TODO: This artwork screen has a bunch of extra props, I believe to support pagination
// Can we get rid of them and just pass the artworkID?
const ArtworkWrapper: React.FC<ArtworkWrapperProps> = ({ route }) => {
  return (
    <NewNavComponentWrapper route={route}>
      <ArtworkPageableScreen
        artworkID={route.params.artworkID}
        isVisible={true}
        pageableSlugs={[]}
        onLoad={() => console.log("what was i made for :(?")}
      />
    </NewNavComponentWrapper>
  )
}

type CollectionRouteParams = {
  Collection: {
    collectionID: string
  }
}

type CollectionWrapperProps = {
  route: RouteProp<CollectionRouteParams, "Collection">
}

const CollectionWrapper: React.FC<CollectionWrapperProps> = ({ route }) => {
  return (
    <NewNavComponentWrapper route={route}>
      <CollectionQueryRenderer collectionID={route.params.collectionID} />
    </NewNavComponentWrapper>
  )
}

export const SearchRouter = () => {
  return (
    <StackNav.Group>
      <StackNav.Screen name="Search" component={SearchScreen} />
      <StackNav.Screen name="Artist" component={ArtistQueryRenderer} />
      <StackNav.Screen name="Partner" component={PartnerQueryRenderer} />
      <StackNav.Screen name="Artwork" component={ArtworkWrapper} />
      <StackNav.Screen name="Collection" component={CollectionWrapper} />
      <StackNav.Screen name="ArtistSeries" component={ArtistSeriesWrapper} />
      <StackNav.Screen name="LocalDiscovery" component={CityGuideView} />
    </StackNav.Group>
  )
}
