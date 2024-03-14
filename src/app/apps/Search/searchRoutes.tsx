import { RouteProp } from "@react-navigation/native"
import { CityGuideView } from "app/NativeModules/CityGuideView"
import { StackNav } from "app/Navigation"
import { ArticleScreen } from "app/Scenes/Article/ArticleScreen"
import { ArtistQueryRenderer } from "app/Scenes/Artist/Artist"
import { ArtistSeriesQueryRenderer } from "app/Scenes/ArtistSeries/ArtistSeries"
import { ArtworkPageableScreen } from "app/Scenes/Artwork/Artwork"
import { CollectionQueryRenderer } from "app/Scenes/Collection/Collection"
import { PartnerQueryRenderer } from "app/Scenes/Partner/Partner"
import { SaleQueryRenderer } from "app/Scenes/Sale/Sale"
import { SearchScreen } from "app/Scenes/Search/Search"
import { LegacyBackButtonContext } from "app/system/navigation/NavStack"
import { NewNavComponentWrapper } from "app/system/newNavigation/NewNavComponentWrapper"
import { BackButton } from "app/system/newNavigation/NewNavLegacyBackButton"
import { ScreenPadding } from "app/system/newNavigation/ScreenPadding"
import { useState } from "react"

export type SearchRoutes = {
  Search: undefined
  Article: { articleID: string }
  Artist: { artistID: string } // TODO: some of these probably don't belong here
  Artwork: { artworkID: string }
  Auction: { saleID: string }
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
      <ScreenPadding fullBleed={false} isPresentedModally={false} isVisible={true}>
        <ArtworkPageableScreen
          artworkID={route.params.artworkID}
          isVisible={true}
          pageableSlugs={[]}
          onLoad={() => console.log("what was i made for :(?")}
        />
      </ScreenPadding>
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
  const [_, updateShouldHideBackButton] = useState(false)

  return (
    <NewNavComponentWrapper route={route}>
      <LegacyBackButtonContext.Provider value={{ updateShouldHideBackButton }}>
        <ScreenPadding fullBleed={true} isPresentedModally={false} isVisible={true}>
          <CollectionQueryRenderer collectionID={route.params.collectionID} />
          <BackButton show={true} />
        </ScreenPadding>
      </LegacyBackButtonContext.Provider>
    </NewNavComponentWrapper>
  )
}

type ArtistRouteParams = {
  Artist: {
    artistID: string
  }
}

type ArtistWrapperProps = {
  route: RouteProp<ArtistRouteParams, "Artist">
}

const ArtistWrapper: React.FC<ArtistWrapperProps> = ({ route }) => {
  return (
    <NewNavComponentWrapper route={route}>
      <ArtistQueryRenderer artistID={route.params.artistID} />
    </NewNavComponentWrapper>
  )
}

type PartnerRouteParams = {
  Partner: {
    partnerID: string
  }
}

type PartnerWrapperProps = {
  route: RouteProp<PartnerRouteParams, "Partner">
}

const PartnerWrapper: React.FC<PartnerWrapperProps> = ({ route }) => {
  // TODO: What is with the isVisible prop?
  return (
    <NewNavComponentWrapper route={route}>
      <PartnerQueryRenderer partnerID={route.params.partnerID} isVisible={true} />
    </NewNavComponentWrapper>
  )
}

type ArticleRouteParams = {
  Article: {
    articleID: string
  }
}

type ArticleWrapperProps = {
  route: RouteProp<ArticleRouteParams, "Article">
}

const ArticleWrapper: React.FC<ArticleWrapperProps> = ({ route }) => {
  return (
    <NewNavComponentWrapper route={route}>
      <ArticleScreen articleID={route.params.articleID} />
    </NewNavComponentWrapper>
  )
}

type AuctionRouteParams = {
  Auction: {
    saleID: string
  }
}

type AuctionWrapperProps = {
  route: RouteProp<AuctionRouteParams, "Auction">
}

const AuctionWrapper: React.FC<AuctionWrapperProps> = ({ route }) => {
  const [_, updateShouldHideBackButton] = useState(false)

  return (
    <NewNavComponentWrapper route={route}>
      <LegacyBackButtonContext.Provider value={{ updateShouldHideBackButton }}>
        <ScreenPadding fullBleed={false} isPresentedModally={false} isVisible={true}>
          <SaleQueryRenderer saleID={route.params.saleID} />
          <BackButton show={true} />
        </ScreenPadding>
      </LegacyBackButtonContext.Provider>
    </NewNavComponentWrapper>
  )
}

export const SearchRouter = () => {
  return (
    <StackNav.Group>
      <StackNav.Screen name="Search" component={SearchScreen} />
      <StackNav.Screen name="Artist" component={ArtistWrapper} />
      <StackNav.Screen name="Article" component={ArticleWrapper} />
      <StackNav.Screen name="Auction" component={AuctionWrapper} />
      <StackNav.Screen name="Partner" component={PartnerWrapper} />
      <StackNav.Screen name="Artwork" component={ArtworkWrapper} />
      <StackNav.Screen name="Collection" component={CollectionWrapper} />
      <StackNav.Screen name="ArtistSeries" component={ArtistSeriesWrapper} />
      <StackNav.Screen name="LocalDiscovery" component={CityGuideView} />
    </StackNav.Group>
  )
}
