import { defaultEnvironment } from "lib/relay/createEnvironment"
import React from "react"
import { AppRegistry, LogBox, View } from "react-native"
import { RelayEnvironmentProvider } from "relay-hooks"

import { SafeAreaInsets } from "lib/types/SafeAreaInsets"
import { Theme } from "palette"
import { BidFlowQueryRenderer } from "./Containers/BidFlow"
import { GeneQueryRenderer } from "./Containers/Gene"
import { InboxWrapper } from "./Containers/Inbox"
import { InquiryQueryRenderer } from "./Containers/Inquiry"
import { RegistrationFlowQueryRenderer } from "./Containers/RegistrationFlow"
import { WorksForYouQueryRenderer } from "./Containers/WorksForYou"
import { About } from "./Scenes/About/About"
import { ArtistQueryRenderer } from "./Scenes/Artist/Artist"
import { ArtistSeriesQueryRenderer } from "./Scenes/ArtistSeries/ArtistSeries"
import { ArtistSeriesFullArtistSeriesListQueryRenderer } from "./Scenes/ArtistSeries/ArtistSeriesFullArtistSeriesList"
import { ArtistShows2QueryRenderer } from "./Scenes/ArtistShows/ArtistShows2"
import { ArtworkQueryRenderer } from "./Scenes/Artwork/Artwork"
import { ArtworkAttributionClassFAQQueryRenderer } from "./Scenes/ArtworkAttributionClassFAQ"
import { CityView } from "./Scenes/City"
import { CityBMWListQueryRenderer } from "./Scenes/City/CityBMWList"
import { CityFairListQueryRenderer } from "./Scenes/City/CityFairList"
import { CityPicker } from "./Scenes/City/CityPicker"
import { CitySavedListQueryRenderer } from "./Scenes/City/CitySavedList"
import { CitySectionListQueryRenderer } from "./Scenes/City/CitySectionList"
import { CollectionQueryRenderer } from "./Scenes/Collection/Collection"
import { CollectionFullFeaturedArtistListQueryRenderer } from "./Scenes/Collection/Components/FullFeaturedArtistList"
import { ConversationNavigator } from "./Scenes/Inbox/ConversationNavigator"

// Consignments / My Collection
import { Consignments } from "./Scenes/Consignments"
import { ConsignmentsSubmissionForm } from "./Scenes/Consignments/ConsignmentsHome/ConsignmentsSubmissionForm"

import { FadeIn } from "./Components/FadeIn"
import { _FancyModalPageWrapper } from "./Components/FancyModal/FancyModalContext"
import { NativeViewController } from "./Components/NativeViewController"
import { BottomTabs } from "./Scenes/BottomTabs/BottomTabs"
import {
  FairArtistsQueryRenderer,
  FairArtworksQueryRenderer,
  FairBMWArtActivationQueryRenderer,
  FairBoothQueryRenderer,
  FairExhibitorsQueryRenderer,
  FairMoreInfoQueryRenderer,
} from "./Scenes/Fair"
import { FairQueryRenderer } from "./Scenes/Fair/Fair"
import { Fair2QueryRenderer } from "./Scenes/Fair2/Fair2"
import { Fair2AllFollowedArtistsQueryRenderer } from "./Scenes/Fair2/Fair2AllFollowedArtists"
import { Fair2MoreInfoQueryRenderer } from "./Scenes/Fair2/Fair2MoreInfo"
import { Favorites } from "./Scenes/Favorites/Favorites"
import { FeatureQueryRenderer } from "./Scenes/Feature/Feature"
import { HomeQueryRenderer } from "./Scenes/Home/Home"
import { MapContainer } from "./Scenes/Map"
import { MyAccountQueryRenderer } from "./Scenes/MyAccount/MyAccount"
import { MyAccountEditEmailQueryRenderer } from "./Scenes/MyAccount/MyAccountEditEmail"
import { MyAccountEditNameQueryRenderer } from "./Scenes/MyAccount/MyAccountEditName"
import { MyAccountEditPassword } from "./Scenes/MyAccount/MyAccountEditPassword"
import { MyAccountEditPhoneQueryRenderer } from "./Scenes/MyAccount/MyAccountEditPhone"
import { MyBidsQueryRenderer } from "./Scenes/MyBids"
import { MyProfileQueryRenderer } from "./Scenes/MyProfile/MyProfile"
import { MyProfilePaymentQueryRenderer } from "./Scenes/MyProfile/MyProfilePayment"
import { MyProfilePaymentNewCreditCard } from "./Scenes/MyProfile/MyProfilePaymentNewCreditCard"
import { MyProfilePushNotificationsQueryRenderer } from "./Scenes/MyProfile/MyProfilePushNotifications"
import { PartnerQueryRenderer } from "./Scenes/Partner"
import { PartnerLocationsQueryRenderer } from "./Scenes/Partner/Screens/PartnerLocations"
import { PrivacyRequest } from "./Scenes/PrivacyRequest"
import { SaleQueryRenderer } from "./Scenes/Sale"
import { SaleFAQ } from "./Scenes/SaleFAQ/SaleFAQ"
import { SaleInfoQueryRenderer } from "./Scenes/SaleInfo"

import { SalesQueryRenderer } from "./Scenes/Sales"
import { Search } from "./Scenes/Search"
import { ShowArtistsQueryRenderer, ShowArtworksQueryRenderer, ShowMoreInfoQueryRenderer } from "./Scenes/Show"
import { ShowQueryRenderer } from "./Scenes/Show/Show"
import { Show2MoreInfoQueryRenderer, Show2QueryRenderer } from "./Scenes/Show2"
import { VanityURLEntityRenderer } from "./Scenes/VanityURL/VanityURLEntity"

import { BottomTabsNavigator } from "./Scenes/BottomTabs/BottomTabsNavigator"
import { BottomTabOption, BottomTabType } from "./Scenes/BottomTabs/BottomTabType"
import { MyCollectionQueryRenderer } from "./Scenes/MyCollection/MyCollection"
import { MyCollectionArtworkQueryRenderer } from "./Scenes/MyCollection/Screens/Artwork/MyCollectionArtwork"
import { MyCollectionArtworkFullDetailsQueryRenderer } from "./Scenes/MyCollection/Screens/ArtworkFullDetails/MyCollectionArtworkFullDetails"
import { MyCollectionArtworkImagesQueryRenderer } from "./Scenes/MyCollection/Screens/ArtworkImages/MyCollectionArtworkImages"
import { ViewingRoomQueryRenderer } from "./Scenes/ViewingRoom/ViewingRoom"
import { ViewingRoomArtworkQueryRenderer } from "./Scenes/ViewingRoom/ViewingRoomArtwork"
import { ViewingRoomArtworksQueryRenderer } from "./Scenes/ViewingRoom/ViewingRoomArtworks"
import { ViewingRoomsListQueryRenderer } from "./Scenes/ViewingRoom/ViewingRoomsList"
import { GlobalStore, GlobalStoreProvider, useSelectedTab } from "./store/GlobalStore"
import { Schema, screenTrack, track } from "./utils/track"
import { ProvideScreenDimensions, useScreenDimensions } from "./utils/useScreenDimensions"

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
  "Calling `getNode()` on the ref of an Animated component is no longer necessary.",
  "RelayResponseNormalizer: Payload did not contain a value for field `id: id`. Check that you are parsing with the same query that was used to fetch the payload.",

  // RN 0.59.0 ships with this bug, see: https://github.com/facebook/react-native/issues/16376
  "RCTBridge required dispatch_sync to load RCTDevLoadingView. This may lead to deadlocks",

  // The following item exist in node_modules. Once this PR is merged, to make warnings opt-in, we can ignore: https://github.com/facebook/metro/issues/287

  // RN 0.59.0 ships with this issue, which has been effectively marked as #wontfix: https://github.com/facebook/react-native/issues/23130
  "Require cycle: node_modules/react-native/Libraries/Network/fetch.js -> node_modules/react-native/Libraries/vendor/core/whatwg-fetch.js -> node_modules/react-native/Libraries/Network/fetch.js",

  "Require cycle: src/lib/store/GlobalStore.tsx",

  // This is for the Artist page, which will likely get redone soon anyway.
  "VirtualizedLists should never be nested inside plain ScrollViews with the same orientation - use another VirtualizedList-backed container instead.",
])

interface ArtworkProps {
  artworkID: string
  isVisible: boolean
}

const Artwork: React.FC<ArtworkProps> = (props) => <ArtworkQueryRenderer {...props} />

interface PartnerProps {
  partnerID: string
  safeAreaInsets: SafeAreaInsets
  isVisible: boolean
}

const Partner: React.FC<PartnerProps> = (props) => <PartnerQueryRenderer {...props} />

interface PartnerLocationsProps {
  partnerID: string
  safeAreaInsets: SafeAreaInsets
  isVisible: boolean
}
const PartnerLocations: React.FC<PartnerLocationsProps> = (props) => <PartnerLocationsQueryRenderer {...props} />

const Inbox: React.FC<{ isVisible: boolean }> = screenTrack<{}>(() => {
  return { context_screen: Schema.PageNames.InboxPage, context_screen_owner_type: null }
})((props) => <InboxWrapper {...props} />)

interface GeneProps {
  geneID: string
  medium: string
  price_range: string
}

const Gene: React.FC<GeneProps> = screenTrack<GeneProps>((props) => {
  return {
    context_screen: Schema.PageNames.GenePage,
    context_screen_owner_slug: props.geneID,
    context_screen_owner_type: Schema.OwnerEntityTypes.Gene,
  }
})((props) => {
  return <GeneQueryRenderer {...props} />
})

interface InquiryProps {
  artworkID: string
}
const Inquiry: React.FC<InquiryProps> = screenTrack<InquiryProps>((props) => {
  return {
    context_screen: Schema.PageNames.InquiryPage,
    context_screen_owner_slug: props.artworkID,
    context_screen_owner_type: Schema.OwnerEntityTypes.Artwork,
  }
})((props) => <InquiryQueryRenderer {...props} />)

interface ConversationProps {
  conversationID: string
}
const Conversation: React.FC<ConversationProps> = screenTrack<ConversationProps>((props) => {
  return {
    context_screen: Schema.PageNames.ConversationPage,
    context_screen_owner_id: props.conversationID,
    context_screen_owner_type: Schema.OwnerEntityTypes.Conversation,
  }
})(ConversationNavigator)

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

const BidderFlow: React.FC<BidderFlowProps> = ({ intent, ...restProps }) => {
  switch (intent) {
    case "bid":
      return <BidFlowQueryRenderer {...restProps} />
    case "register":
      return <RegistrationFlowQueryRenderer {...restProps} />
  }
}

interface ShowArtistsProps {
  showID: string
}
const ShowArtists: React.FC<ShowArtistsProps> = ({ showID }) => {
  return <ShowArtistsQueryRenderer showID={showID} />
}

interface ShowArtworksProps {
  showID: string
}
const ShowArtworks: React.FC<ShowArtworksProps> = ({ showID }) => {
  return <ShowArtworksQueryRenderer showID={showID} />
}

interface ShowMoreInfoProps {
  showID: string
}
const ShowMoreInfo: React.FC<ShowMoreInfoProps> = ({ showID }) => {
  return <ShowMoreInfoQueryRenderer showID={showID} />
}

interface FairBoothProps {
  fairBoothID: string
}

const FairBooth: React.FC<FairBoothProps> = ({ fairBoothID }) => {
  return <FairBoothQueryRenderer showID={fairBoothID} />
}

interface FairArtistsProps {
  fairID: string
}

const FairArtists: React.FC<FairArtistsProps> = screenTrack<FairArtistsProps>((props) => {
  return {
    context_screen: Schema.PageNames.FairAllArtistsPage,
    context_screen_owner_slug: props.fairID,
    context_screen_owner_type: Schema.OwnerEntityTypes.Fair,
  }
})(({ fairID }) => {
  return <FairArtistsQueryRenderer fairID={fairID} />
})

interface FairArtworksProps {
  fairID: string
}

const FairArtworks: React.FC<FairArtworksProps> = ({ fairID }) => {
  return <FairArtworksQueryRenderer fairID={fairID} />
}

interface FairExhibitorsProps {
  fairID: string
}

const FairExhibitors: React.FC<FairExhibitorsProps> = ({ fairID }) => {
  return <FairExhibitorsQueryRenderer fairID={fairID} />
}

interface FairBMWArtActivationProps {
  fairID: string
}
const FairBMWArtActivation: React.FC<FairBMWArtActivationProps> = ({ fairID }) => {
  return <FairBMWArtActivationQueryRenderer fairID={fairID} />
}

interface SearchWithTrackingProps {
  safeAreaInsets: SafeAreaInsets
}
const SearchWithTracking: React.FC<SearchWithTrackingProps> = screenTrack<SearchWithTrackingProps>(() => {
  return {
    context_screen: Schema.PageNames.Search,
    context_screen_owner_type: Schema.OwnerEntityTypes.Search,
  }
})((props) => {
  return <Search {...props} />
})

interface PageWrapperProps {
  fullBleed?: boolean
}

const InnerPageWrapper: React.FC<PageWrapperProps> = ({ children, fullBleed }) => {
  const paddingTop = fullBleed ? 0 : useScreenDimensions().safeAreaInsets.top
  const paddingBottom = fullBleed ? 0 : useScreenDimensions().safeAreaInsets.bottom
  const isHydrated = GlobalStore.useAppState((state) => state.sessionState.isHydrated)
  return (
    <View style={{ flex: 1, paddingTop, paddingBottom }}>
      {isHydrated ? (
        <FadeIn style={{ flex: 1 }} slide={false}>
          {children}
        </FadeIn>
      ) : null}
    </View>
  )
}

// provide the tracking context so pages can use `useTracking` all the time
@track()
class PageWrapper extends React.Component<PageWrapperProps> {
  render() {
    return (
      <ProvideScreenDimensions>
        <RelayEnvironmentProvider environment={defaultEnvironment}>
          <GlobalStoreProvider>
            <Theme>
              <_FancyModalPageWrapper>
                <InnerPageWrapper {...this.props} />
              </_FancyModalPageWrapper>
            </Theme>
          </GlobalStoreProvider>
        </RelayEnvironmentProvider>
      </ProvideScreenDimensions>
    )
  }
}

function register(screenName: string, Component: React.ComponentType<any>, options?: PageWrapperProps) {
  const ComponentWithVisibility = (props: any) => {
    // if we're in a modal, just pass isVisible through
    const currentTab = useSelectedTab()
    let isVisible = props.isVisible
    if (BottomTabOption[props.navStackID as BottomTabType]) {
      // otherwise, make sure it respects the current tab
      isVisible = isVisible && currentTab === props.navStackID
    }
    return <Component {...{ ...props, isVisible }} />
  }

  const WrappedComponent = (props: any) => (
    <PageWrapper {...options}>
      <ComponentWithVisibility {...props} />
    </PageWrapper>
  )
  AppRegistry.registerComponent(screenName, () => WrappedComponent)
}

export interface ViewOptions {
  modalPresentationStyle?: "fullScreen" | "pageSheet" | "formSheet"
  hasOwnModalCloseButton?: boolean
  alwaysPresentModally?: boolean
  hidesBackButton?: boolean
  fullBleed?: boolean
  // If this module is the root view of a particular tab, name it here
  isRootViewForTabName?: BottomTabType
  // If this module should only be shown in one particular tab, name it here
  onlyShowInTabName?: BottomTabType
}

type ModuleDescriptor =
  | {
      type: "react"
      Component: React.ComponentType<any>
      options: ViewOptions
    }
  | {
      type: "native"
      options: ViewOptions
    }

function reactModule(Component: React.ComponentType<any>, options: ViewOptions = {}): ModuleDescriptor {
  return { type: "react", options, Component }
}

function nativeModule(options: ViewOptions = {}): ModuleDescriptor {
  return { type: "native", options }
}

// little helper function to make sure we get both intellisense and good type information on the result
function defineModules<T extends string>(obj: Record<T, ModuleDescriptor>) {
  return obj
}

export type AppModule = keyof typeof modules

export const modules = defineModules({
  Admin: nativeModule(),
  About: reactModule(About),
  Artist: reactModule(ArtistQueryRenderer),
  ArtistShows: reactModule(ArtistShows2QueryRenderer),
  ArtistSeries: reactModule(ArtistSeriesQueryRenderer),
  Artwork: reactModule(Artwork),
  ArtworkAttributionClassFAQ: reactModule(ArtworkAttributionClassFAQQueryRenderer),
  Auction: nativeModule(),
  Auction2: reactModule(SaleQueryRenderer, { fullBleed: true }),
  Auctions: reactModule(SalesQueryRenderer),
  AuctionInfo: reactModule(SaleInfoQueryRenderer),
  AuctionFAQ: reactModule(SaleFAQ),
  AuctionRegistration: nativeModule({ alwaysPresentModally: true }),
  AuctionBidArtwork: nativeModule({ alwaysPresentModally: true }),
  BidFlow: reactModule(BidderFlow),
  BottomTabs: reactModule(BottomTabs, { fullBleed: true }),
  City: reactModule(CityView, { fullBleed: true }),
  CityBMWList: reactModule(CityBMWListQueryRenderer, { fullBleed: true }),
  CityFairList: reactModule(CityFairListQueryRenderer, { fullBleed: true }),
  CityPicker: reactModule(CityPicker, { fullBleed: true }),
  CitySavedList: reactModule(CitySavedListQueryRenderer),
  CitySectionList: reactModule(CitySectionListQueryRenderer),
  Collection: reactModule(CollectionQueryRenderer, { fullBleed: true }),
  ConsignmentsSubmissionForm: reactModule(ConsignmentsSubmissionForm, {
    alwaysPresentModally: true,
    hasOwnModalCloseButton: true,
  }),
  Conversation: reactModule(Conversation, { onlyShowInTabName: "inbox" }),
  Fair: reactModule(FairQueryRenderer, { fullBleed: true }),
  Fair2: reactModule(Fair2QueryRenderer, { fullBleed: true }),
  Fair2MoreInfo: reactModule(Fair2MoreInfoQueryRenderer),
  Fair2AllFollowedArtists: reactModule(Fair2AllFollowedArtistsQueryRenderer),
  FairArtists: reactModule(FairArtists),
  FairArtworks: reactModule(FairArtworks),
  FairBMWArtActivation: reactModule(FairBMWArtActivation, { fullBleed: true }),
  FairBooth: reactModule(FairBooth),
  FairExhibitors: reactModule(FairExhibitors),
  FairMoreInfo: reactModule(FairMoreInfoQueryRenderer),
  Favorites: reactModule(Favorites),
  Feature: reactModule(FeatureQueryRenderer, { fullBleed: true }),
  FullArtistSeriesList: reactModule(ArtistSeriesFullArtistSeriesListQueryRenderer),
  FullFeaturedArtistList: reactModule(CollectionFullFeaturedArtistListQueryRenderer),
  Gene: reactModule(Gene),
  Home: reactModule(HomeQueryRenderer, { isRootViewForTabName: "home" }),
  Inbox: reactModule(Inbox, { isRootViewForTabName: "inbox" }),
  Inquiry: reactModule(Inquiry, { alwaysPresentModally: true, hasOwnModalCloseButton: true }),
  LiveAuction: nativeModule({
    alwaysPresentModally: true,
    hasOwnModalCloseButton: true,
    modalPresentationStyle: "fullScreen",
  }),
  LocalDiscovery: nativeModule(),
  WebView: nativeModule(),
  Map: reactModule(MapContainer, { fullBleed: true }),
  MyAccount: reactModule(MyAccountQueryRenderer),
  MyAccountEditEmail: reactModule(MyAccountEditEmailQueryRenderer, { hidesBackButton: true }),
  MyAccountEditName: reactModule(MyAccountEditNameQueryRenderer, { hidesBackButton: true }),
  MyAccountEditPassword: reactModule(MyAccountEditPassword, { hidesBackButton: true }),
  MyAccountEditPhone: reactModule(MyAccountEditPhoneQueryRenderer, { hidesBackButton: true }),
  MyBids: reactModule(MyBidsQueryRenderer),
  MyCollection: reactModule(MyCollectionQueryRenderer),
  MyCollectionArtwork: reactModule(MyCollectionArtworkQueryRenderer),
  MyCollectionArtworkFullDetails: reactModule(MyCollectionArtworkFullDetailsQueryRenderer),
  MyCollectionArtworkImages: reactModule(MyCollectionArtworkImagesQueryRenderer),
  MyProfile: reactModule(MyProfileQueryRenderer, { isRootViewForTabName: "profile" }),
  MyProfilePayment: reactModule(MyProfilePaymentQueryRenderer),
  MyProfilePaymentNewCreditCard: reactModule(MyProfilePaymentNewCreditCard, { hidesBackButton: true }),
  MyProfilePushNotifications: reactModule(MyProfilePushNotificationsQueryRenderer),
  MySellingProfile: reactModule(View),
  Partner: reactModule(Partner, { fullBleed: true }),
  PartnerLocations: reactModule(PartnerLocations),
  PrivacyRequest: reactModule(PrivacyRequest),
  Sales: reactModule(Consignments, { isRootViewForTabName: "sell" }),
  SalesNotRootTabView: reactModule(Consignments),
  Search: reactModule(SearchWithTracking, { isRootViewForTabName: "search" }),
  Show: reactModule(ShowQueryRenderer),
  Show2: reactModule(Show2QueryRenderer, { fullBleed: true }),
  ShowArtists: reactModule(ShowArtists),
  ShowArtworks: reactModule(ShowArtworks),
  Show2MoreInfo: reactModule(Show2MoreInfoQueryRenderer),
  ShowMoreInfo: reactModule(ShowMoreInfo),
  VanityURLEntity: reactModule(VanityURLEntityRenderer, { fullBleed: true }),
  ViewingRoom: reactModule(ViewingRoomQueryRenderer, { fullBleed: true }),
  ViewingRoomArtwork: reactModule(ViewingRoomArtworkQueryRenderer),
  ViewingRoomArtworks: reactModule(ViewingRoomArtworksQueryRenderer),
  ViewingRooms: reactModule(ViewingRoomsListQueryRenderer),
  WorksForYou: reactModule(WorksForYouQueryRenderer),
})

// Register react modules with the app registry
for (const moduleName of Object.keys(modules)) {
  const descriptor = modules[moduleName as AppModule]
  if ("Component" in descriptor) {
    register(moduleName, descriptor.Component, { fullBleed: descriptor.options.fullBleed })
  }
}

const Main: React.FC<{}> = track()(({}) => {
  const isHydrated = GlobalStore.useAppState((state) => state.sessionState.isHydrated)
  const isLoggedIn = GlobalStore.useAppState((state) => !!state.native.sessionState.userID)
  const onboardingState = GlobalStore.useAppState((state) => state.native.sessionState.onboardingState)

  if (!isHydrated) {
    return <View></View>
  }
  if (!isLoggedIn || onboardingState === "incomplete") {
    return <NativeViewController viewName="Onboarding" />
  }
  return <BottomTabsNavigator />
})

register("Main", Main, { fullBleed: true })
