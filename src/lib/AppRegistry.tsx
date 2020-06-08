import React from "react"
import { AppRegistry, View, YellowBox } from "react-native"

import { Theme } from "@artsy/palette"
import { SafeAreaInsets } from "lib/types/SafeAreaInsets"
import { ArtistQueryRenderer } from "./Containers/Artist"
import { BidFlowRenderer } from "./Containers/BidFlow"
import { ConversationRenderer } from "./Containers/Conversation"
import { GeneRenderer } from "./Containers/Gene"
import { InboxRenderer } from "./Containers/Inbox"
import { InquiryRenderer } from "./Containers/Inquiry"
import { RegistrationFlowRenderer } from "./Containers/RegistrationFlow"
import { WorksForYouRenderer } from "./Containers/WorksForYou"
import { ArtworkQueryRenderer } from "./Scenes/Artwork/Artwork"
import { ArtworkAttributionClassFAQRenderer } from "./Scenes/ArtworkAttributionClassFAQ"
import { CityView } from "./Scenes/City"
import { CityBMWListRenderer } from "./Scenes/City/CityBMWList"
import { CityFairListRenderer } from "./Scenes/City/CityFairList"
import { CityPicker } from "./Scenes/City/CityPicker"
import { CitySavedListRenderer } from "./Scenes/City/CitySavedList"
import { CitySectionListRenderer } from "./Scenes/City/CitySectionList"
import { CollectionRenderer } from "./Scenes/Collection/Collection"
import { CollectionFullFeaturedArtistListRenderer } from "./Scenes/Collection/Components/FullFeaturedArtistList"
import Consignments from "./Scenes/Consignments"
import { SellTabLanding } from "./Scenes/Consignments/SellTabLanding"
import {
  FairArtistsRenderer,
  FairArtworksRenderer,
  FairBMWArtActivationRenderer,
  FairBoothRenderer,
  FairExhibitorsRenderer,
  FairMoreInfoRenderer,
} from "./Scenes/Fair"
import { FairRenderer } from "./Scenes/Fair/Fair"
import FavoritesScene from "./Scenes/Favorites"
import { HomeRenderer } from "./Scenes/Home/Home"
import { MapContainer } from "./Scenes/Map"
import { NewSubmissionForm } from "./Scenes/MyCollection/NewSubmissionForm"
import { PartnerRenderer } from "./Scenes/Partner"
import { PartnerLocationsRenderer } from "./Scenes/Partner/Screens/PartnerLocations"
import { PrivacyRequest } from "./Scenes/PrivacyRequest"
import { SalesRenderer } from "./Scenes/Sales"
import { Search } from "./Scenes/Search"
import { MyProfile } from "./Scenes/Settings/MyProfile"
import { ShowArtistsRenderer, ShowArtworksRenderer, ShowMoreInfoRenderer } from "./Scenes/Show"
import { ShowRenderer } from "./Scenes/Show/Show"
import { ViewingRoomRenderer } from "./Scenes/ViewingRoom/ViewingRoom"
import { ViewingRoomArtworksRenderer } from "./Scenes/ViewingRoom/ViewingRoomArtworks"
import { ViewingRoomsListRenderer } from "./Scenes/ViewingRoom/ViewingRoomsList"
import { Schema, screenTrack, track } from "./utils/track"
import { ProvideScreenDimensions, useScreenDimensions } from "./utils/useScreenDimensions"

YellowBox.ignoreWarnings([
  "Calling `getNode()` on the ref of an Animated component is no longer necessary.",
  "RelayResponseNormalizer: Payload did not contain a value for field `id: id`. Check that you are parsing with the same query that was used to fetch the payload.",
  // Deprecated, we'll transition when it's removed.
  "Warning: ListView is deprecated and will be removed in a future release. See https://fb.me/nolistview for more information",

  // RN 0.59.0 ships with RNCameraRoll with this issue: https://github.com/facebook/react-native/issues/23755
  // We can remove this once this PR gets shipped and we update: https://github.com/facebook/react-native/pull/24314
  "Module RCTImagePickerManager requires main queue setup since it overrides `init`",

  // RN 0.59.0 ships with this bug, see: https://github.com/facebook/react-native/issues/16376
  "RCTBridge required dispatch_sync to load RCTDevLoadingView. This may lead to deadlocks",

  // The following two items exist in node_modules. Once this PR is merged, to make warnings opt-in, we can ignore: https://github.com/facebook/metro/issues/287

  // react-native-sentry ships with this error, tracked here: https://github.com/getsentry/react-native-sentry/issues/479
  "Require cycle: node_modules/react-native-sentry/lib/Sentry.js -> node_modules/react-native-sentry/lib/RavenClient.js -> node_modules/react-native-sentry/lib/Sentry.js",
  // RN 0.59.0 ships with this issue, which has been effectively marked as #wontfix: https://github.com/facebook/react-native/issues/23130
  "Require cycle: node_modules/react-native/Libraries/Network/fetch.js -> node_modules/react-native/Libraries/vendor/core/whatwg-fetch.js -> node_modules/react-native/Libraries/Network/fetch.js",

  // This is for the Artist page, which will likely get redone soon anyway.
  "VirtualizedLists should never be nested inside plain ScrollViews with the same orientation - use another VirtualizedList-backed container instead.",
])

interface ArtworkProps {
  artworkID: string
  isVisible: boolean
}

const Artwork: React.SFC<ArtworkProps> = props => <ArtworkQueryRenderer {...props} />

interface PartnerProps {
  partnerID: string
  safeAreaInsets: SafeAreaInsets
  isVisible: boolean
}

const Partner: React.SFC<PartnerProps> = props => <PartnerRenderer {...props} />

interface PartnerLocationsProps {
  partnerID: string
  safeAreaInsets: SafeAreaInsets
  isVisible: boolean
}
const PartnerLocations: React.SFC<PartnerLocationsProps> = props => <PartnerLocationsRenderer {...props} />

const Inbox: React.SFC<{}> = screenTrack<{}>(
  // @ts-ignore STRICTNESS_MIGRATION
  () => {
    return { context_screen: Schema.PageNames.InboxPage, context_screen_owner_type: null }
  }
  // @ts-ignore STRICTNESS_MIGRATION
)(props => <InboxRenderer {...props} />)

interface GeneProps {
  geneID: string
  refineSettings: { medium: string; price_range: string }
}

const Gene: React.SFC<GeneProps> = screenTrack<GeneProps>(props => {
  return {
    context_screen: Schema.PageNames.GenePage,
    context_screen_owner_slug: props.geneID,
    context_screen_owner_type: Schema.OwnerEntityTypes.Gene,
  }
})(({ geneID, refineSettings: { medium, price_range } }) => {
  const initialProps = { geneID, medium, price_range }
  return <GeneRenderer {...initialProps} />
})

interface InquiryProps {
  artworkID: string
}
const Inquiry: React.SFC<InquiryProps> = screenTrack<InquiryProps>(props => {
  return {
    context_screen: Schema.PageNames.InquiryPage,
    context_screen_owner_slug: props.artworkID,
    context_screen_owner_type: Schema.OwnerEntityTypes.Artwork,
  }
})(props => <InquiryRenderer {...props} />)

interface ConversationProps {
  conversationID: string
}
const Conversation: React.SFC<ConversationProps> = screenTrack<ConversationProps>(props => {
  return {
    context_screen: Schema.PageNames.ConversationPage,
    context_screen_owner_id: props.conversationID,
    context_screen_owner_type: Schema.OwnerEntityTypes.Conversation,
  }
})(ConversationRenderer)

/*
 * Route bid/register requests coming from the Emission pod to either a BidFlow
 * or RegisterFlow component with an appropriate query renderer
 */
type BidderFlowIntent = "bid" | "register"
interface BidderFlowProps {
  artworkID?: string
  saleID: string
  intent: BidderFlowIntent
}

const BidderFlow: React.SFC<BidderFlowProps> = ({ intent, ...restProps }) => {
  switch (intent) {
    case "bid":
      return <BidFlowRenderer {...restProps} />
    case "register":
      return <RegistrationFlowRenderer {...restProps} />
  }
}

interface ShowArtistsProps {
  showID: string
}
const ShowArtists: React.SFC<ShowArtistsProps> = ({ showID }) => {
  return <ShowArtistsRenderer showID={showID} />
}

interface ShowArtworksProps {
  showID: string
}
const ShowArtworks: React.SFC<ShowArtworksProps> = ({ showID }) => {
  return <ShowArtworksRenderer showID={showID} />
}

interface ShowMoreInfoProps {
  showID: string
}
const ShowMoreInfo: React.SFC<ShowMoreInfoProps> = ({ showID }) => {
  return <ShowMoreInfoRenderer showID={showID} />
}

interface FairBoothProps {
  fairBoothID: string
}

const FairBooth: React.SFC<FairBoothProps> = ({ fairBoothID }) => {
  return <FairBoothRenderer showID={fairBoothID} />
}

interface FairArtistsProps {
  fairID: string
}

const FairArtists: React.SFC<FairArtistsProps> = screenTrack<FairArtistsProps>(props => {
  return {
    context_screen: Schema.PageNames.FairAllArtistsPage,
    context_screen_owner_slug: props.fairID,
    context_screen_owner_type: Schema.OwnerEntityTypes.Fair,
  }
})(({ fairID }) => {
  return <FairArtistsRenderer fairID={fairID} />
})

interface FairArtworksProps {
  fairID: string
}

const FairArtworks: React.SFC<FairArtworksProps> = ({ fairID }) => {
  return <FairArtworksRenderer fairID={fairID} />
}

interface FairExhibitorsProps {
  fairID: string
}

const FairExhibitors: React.SFC<FairExhibitorsProps> = ({ fairID }) => {
  return <FairExhibitorsRenderer fairID={fairID} />
}

interface FairBMWArtActivationProps {
  fairID: string
}
const FairBMWArtActivation: React.SFC<FairBMWArtActivationProps> = ({ fairID }) => {
  return <FairBMWArtActivationRenderer fairID={fairID} />
}

interface SearchWithTrackingProps {
  safeAreaInsets: SafeAreaInsets
}
const SearchWithTracking: React.SFC<SearchWithTrackingProps> = screenTrack<SearchWithTrackingProps>(() => {
  return {
    context_screen: Schema.PageNames.Search,
    context_screen_owner_type: Schema.OwnerEntityTypes.Search,
  }
})(props => {
  return <Search {...props} />
})

interface PageWrapperProps {
  fullBleed?: boolean
}

const InnerPageWrapper: React.FC<PageWrapperProps> = ({ children, fullBleed }) => {
  const paddingTop = fullBleed ? 0 : useScreenDimensions().safeAreaInsets.top
  return <View style={{ flex: 1, paddingTop }}>{children}</View>
}

// provide the tracking context so pages can use `useTracking` all the time
@track()
class PageWrapper extends React.Component<PageWrapperProps> {
  render() {
    return (
      <Theme>
        <ProvideScreenDimensions>
          <InnerPageWrapper {...this.props} />
        </ProvideScreenDimensions>
      </Theme>
    )
  }
}

function register(screenName: string, Component: React.ComponentType<any>, options?: PageWrapperProps) {
  const WrappedComponent = (props: any) => (
    <PageWrapper {...options}>
      <Component {...props} />
    </PageWrapper>
  )
  AppRegistry.registerComponent(screenName, () => WrappedComponent)
}

// TODO: Change everything to BidderFlow? AuctionAction?
register("Artist", ArtistQueryRenderer)
register("Artwork", Artwork)
register("ArtworkAttributionClassFAQ", ArtworkAttributionClassFAQRenderer)
register("Auctions", SalesRenderer)
register("BidFlow", BidderFlow)
register("City", CityView, { fullBleed: true })
register("CityBMWList", CityBMWListRenderer, { fullBleed: true })
register("CityFairList", CityFairListRenderer, { fullBleed: true })
register("CityPicker", CityPicker, { fullBleed: true })
register("CitySavedList", CitySavedListRenderer)
register("CitySectionList", CitySectionListRenderer)
register("Collection", CollectionRenderer, { fullBleed: true })
register("Consignments", Consignments)
register("SellTabLanding", SellTabLanding)
register("Conversation", Conversation)
register("Fair", FairRenderer, { fullBleed: true })
register("FairArtists", FairArtists)
register("FairArtworks", FairArtworks)
register("FairBMWArtActivation", FairBMWArtActivation, { fullBleed: true })
register("FairBooth", FairBooth)
register("FairExhibitors", FairExhibitors)
register("FairMoreInfo", FairMoreInfoRenderer)
register("Favorites", FavoritesScene)
register("FullFeaturedArtistList", CollectionFullFeaturedArtistListRenderer)
register("Gene", Gene)
register("Home", HomeRenderer)
register("Inbox", Inbox)
register("Inquiry", Inquiry)
register("Map", MapContainer, { fullBleed: true })
register("MyProfile", MyProfile)
register("MySellingProfile", View)
register("NewSubmissionForm", NewSubmissionForm)
register("Partner", Partner, { fullBleed: true })
register("PartnerLocations", PartnerLocations)
register("PrivacyRequest", PrivacyRequest)
register("Sales", Consignments) // Placeholder for sales tab!
register("Search", SearchWithTracking)
register("Show", ShowRenderer)
register("ShowArtists", ShowArtists)
register("ShowArtworks", ShowArtworks)
register("ShowMoreInfo", ShowMoreInfo)
register("ViewingRooms", ViewingRoomsListRenderer)
register("ViewingRoom", ViewingRoomRenderer, { fullBleed: true })
register("ViewingRoomArtworks", ViewingRoomArtworksRenderer)
register("WorksForYou", WorksForYouRenderer)
