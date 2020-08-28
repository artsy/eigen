import { defaultEnvironment } from "lib/relay/createEnvironment"
import React from "react"
import { AppRegistry, View, YellowBox } from "react-native"
import { RelayEnvironmentProvider } from "relay-hooks"

import { SafeAreaInsets } from "lib/types/SafeAreaInsets"
import { Theme } from "palette"
import { ArtistQueryRenderer } from "./Containers/Artist"
import { BidFlowQueryRenderer } from "./Containers/BidFlow"
import { ConversationQueryRenderer } from "./Containers/Conversation"
import { GeneQueryRenderer } from "./Containers/Gene"
import { InboxQueryRenderer } from "./Containers/Inbox"
import { InquiryQueryRenderer } from "./Containers/Inquiry"
import { RegistrationFlowQueryRenderer } from "./Containers/RegistrationFlow"
import { WorksForYouQueryRenderer } from "./Containers/WorksForYou"
import { ArtistSeriesQueryRenderer } from "./Scenes/ArtistSeries/ArtistSeries"
import { ArtistSeriesFullArtistSeriesListQueryRenderer } from "./Scenes/ArtistSeries/ArtistSeriesFullArtistSeriesList"
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

// Consignments / My Collection
import { Consignments } from "./Scenes/Consignments"
import { setupMyCollectionScreen } from "./Scenes/MyCollection/Boot"
import { MyCollectionAddEditArtwork } from "./Scenes/MyCollection/Screens/AddArtwork/MyCollectionAddEditArtwork"
import { MyCollectionArtworkDetail } from "./Scenes/MyCollection/Screens/ArtworkDetail/MyCollectionArtworkDetail"
import { MyCollectionArtworkList } from "./Scenes/MyCollection/Screens/ArtworkList/MyCollectionArtworkList"
import { MyCollectionHome } from "./Scenes/MyCollection/Screens/Home/MyCollectionHome"
import { MyCollectionMarketingHome } from "./Scenes/MyCollection/Screens/Home/MyCollectionMarketingHome"
import { SellTabApp } from "./Scenes/MyCollection/SellTabApp"

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
import { SalesQueryRenderer } from "./Scenes/Sales"
import { Search } from "./Scenes/Search"
import { ShowArtistsQueryRenderer, ShowArtworksQueryRenderer, ShowMoreInfoQueryRenderer } from "./Scenes/Show"
import { ShowQueryRenderer } from "./Scenes/Show/Show"
import { VanityURLEntityRenderer } from "./Scenes/VanityURL/VanityURLEntity"

import { ViewingRoomQueryRenderer } from "./Scenes/ViewingRoom/ViewingRoom"
import { ViewingRoomArtworkQueryRenderer } from "./Scenes/ViewingRoom/ViewingRoomArtwork"
import { ViewingRoomArtworksQueryRenderer } from "./Scenes/ViewingRoom/ViewingRoomArtworks"
import { ViewingRoomsListQueryRenderer } from "./Scenes/ViewingRoom/ViewingRoomsList"
import { AppStore, AppStoreProvider } from "./store/AppStore"
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

const Artwork: React.SFC<ArtworkProps> = (props) => <ArtworkQueryRenderer {...props} />

interface PartnerProps {
  partnerID: string
  safeAreaInsets: SafeAreaInsets
  isVisible: boolean
}

const Partner: React.SFC<PartnerProps> = (props) => <PartnerQueryRenderer {...props} />

interface PartnerLocationsProps {
  partnerID: string
  safeAreaInsets: SafeAreaInsets
  isVisible: boolean
}
const PartnerLocations: React.SFC<PartnerLocationsProps> = (props) => <PartnerLocationsQueryRenderer {...props} />

const Inbox: React.SFC<{}> = screenTrack<{}>(
  // @ts-ignore STRICTNESS_MIGRATION
  () => {
    return { context_screen: Schema.PageNames.InboxPage, context_screen_owner_type: null }
  }
  // @ts-ignore STRICTNESS_MIGRATION
)((props) => <InboxQueryRenderer {...props} />)

interface GeneProps {
  geneID: string
  refineSettings: { medium: string; price_range: string }
}

const Gene: React.SFC<GeneProps> = screenTrack<GeneProps>((props) => {
  return {
    context_screen: Schema.PageNames.GenePage,
    context_screen_owner_slug: props.geneID,
    context_screen_owner_type: Schema.OwnerEntityTypes.Gene,
  }
})(({ geneID, refineSettings: { medium, price_range } }) => {
  const initialProps = { geneID, medium, price_range }
  return <GeneQueryRenderer {...initialProps} />
})

interface InquiryProps {
  artworkID: string
}
const Inquiry: React.SFC<InquiryProps> = screenTrack<InquiryProps>((props) => {
  return {
    context_screen: Schema.PageNames.InquiryPage,
    context_screen_owner_slug: props.artworkID,
    context_screen_owner_type: Schema.OwnerEntityTypes.Artwork,
  }
})((props) => <InquiryQueryRenderer {...props} />)

interface ConversationProps {
  conversationID: string
}
const Conversation: React.SFC<ConversationProps> = screenTrack<ConversationProps>((props) => {
  return {
    context_screen: Schema.PageNames.ConversationPage,
    context_screen_owner_id: props.conversationID,
    context_screen_owner_type: Schema.OwnerEntityTypes.Conversation,
  }
})(ConversationQueryRenderer)

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
      return <BidFlowQueryRenderer {...restProps} />
    case "register":
      return <RegistrationFlowQueryRenderer {...restProps} />
  }
}

interface ShowArtistsProps {
  showID: string
}
const ShowArtists: React.SFC<ShowArtistsProps> = ({ showID }) => {
  return <ShowArtistsQueryRenderer showID={showID} />
}

interface ShowArtworksProps {
  showID: string
}
const ShowArtworks: React.SFC<ShowArtworksProps> = ({ showID }) => {
  return <ShowArtworksQueryRenderer showID={showID} />
}

interface ShowMoreInfoProps {
  showID: string
}
const ShowMoreInfo: React.SFC<ShowMoreInfoProps> = ({ showID }) => {
  return <ShowMoreInfoQueryRenderer showID={showID} />
}

interface FairBoothProps {
  fairBoothID: string
}

const FairBooth: React.SFC<FairBoothProps> = ({ fairBoothID }) => {
  return <FairBoothQueryRenderer showID={fairBoothID} />
}

interface FairArtistsProps {
  fairID: string
}

const FairArtists: React.SFC<FairArtistsProps> = screenTrack<FairArtistsProps>((props) => {
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

const FairArtworks: React.SFC<FairArtworksProps> = ({ fairID }) => {
  return <FairArtworksQueryRenderer fairID={fairID} />
}

interface FairExhibitorsProps {
  fairID: string
}

const FairExhibitors: React.SFC<FairExhibitorsProps> = ({ fairID }) => {
  return <FairExhibitorsQueryRenderer fairID={fairID} />
}

interface FairBMWArtActivationProps {
  fairID: string
}
const FairBMWArtActivation: React.SFC<FairBMWArtActivationProps> = ({ fairID }) => {
  return <FairBMWArtActivationQueryRenderer fairID={fairID} />
}

interface SearchWithTrackingProps {
  safeAreaInsets: SafeAreaInsets
}
const SearchWithTracking: React.SFC<SearchWithTrackingProps> = screenTrack<SearchWithTrackingProps>(() => {
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
  const isHydrated = AppStore.useAppState((state) => state.sessionState.isHydrated)
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
          <AppStoreProvider>
            <Theme>
              <_FancyModalPageWrapper>
                <InnerPageWrapper {...this.props} />
              </_FancyModalPageWrapper>
            </Theme>
          </AppStoreProvider>
        </RelayEnvironmentProvider>
      </ProvideScreenDimensions>
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

interface ModuleDescriptor {
  fullBleed?: boolean
  Component: React.ComponentType<any>
}

// little helper function to make sure we get both intellisense and good type information on the result
function defineModules<T extends string>(obj: Record<T, ModuleDescriptor>) {
  return obj
}

export type AppModule = keyof typeof modules

const modules = defineModules({
  Artist: { Component: ArtistQueryRenderer },
  ArtistSeries: { Component: ArtistSeriesQueryRenderer },
  Artwork: { Component: Artwork },
  ArtworkAttributionClassFAQ: { Component: ArtworkAttributionClassFAQQueryRenderer },
  Auction: { Component: SaleQueryRenderer, fullBleed: true },
  Auctions: { Component: SalesQueryRenderer },
  BidFlow: { Component: BidderFlow },
  BottomTabs: { Component: BottomTabs, fullBleed: true },
  City: { Component: CityView, fullBleed: true },
  CityBMWList: { Component: CityBMWListQueryRenderer, fullBleed: true },
  CityFairList: { Component: CityFairListQueryRenderer, fullBleed: true },
  CityPicker: { Component: CityPicker, fullBleed: true },
  CitySavedList: { Component: CitySavedListQueryRenderer },
  CitySectionList: { Component: CitySectionListQueryRenderer },
  Collection: { Component: CollectionQueryRenderer, fullBleed: true },
  Consignments: { Component: setupMyCollectionScreen(Consignments) },
  Conversation: { Component: Conversation },
  Fair: { Component: FairQueryRenderer, fullBleed: true },
  FairArtists: { Component: FairArtists },
  FairArtworks: { Component: FairArtworks },
  FairBMWArtActivation: { Component: FairBMWArtActivation, fullBleed: true },
  FairBooth: { Component: FairBooth },
  FairExhibitors: { Component: FairExhibitors },
  FairMoreInfo: { Component: FairMoreInfoQueryRenderer },
  Favorites: { Component: Favorites },
  Feature: { Component: FeatureQueryRenderer, fullBleed: true },
  FullArtistSeriesList: { Component: ArtistSeriesFullArtistSeriesListQueryRenderer },
  FullFeaturedArtistList: { Component: CollectionFullFeaturedArtistListQueryRenderer },
  Gene: { Component: Gene },
  Home: { Component: HomeQueryRenderer },
  Inbox: { Component: Inbox },
  Inquiry: { Component: Inquiry },
  Map: { Component: MapContainer, fullBleed: true },
  MyAccount: { Component: MyAccountQueryRenderer },
  MyAccountEditEmail: { Component: MyAccountEditEmailQueryRenderer },
  MyAccountEditName: { Component: MyAccountEditNameQueryRenderer },
  MyAccountEditPassword: { Component: MyAccountEditPassword },
  MyAccountEditPhone: { Component: MyAccountEditPhoneQueryRenderer },
  MyBids: { Component: MyBidsQueryRenderer },
  MyCollectionAddArtwork: { Component: setupMyCollectionScreen(MyCollectionAddArtwork) },
  MyCollectionArtworkDetail: { Component: setupMyCollectionScreen(MyCollectionArtworkDetail) },
  MyCollectionArtworkList: { Component: setupMyCollectionScreen(MyCollectionArtworkList) },
  MyCollectionHome: { Component: setupMyCollectionScreen(MyCollectionHome) },
  MyCollectionMarketingHome: { Component: setupMyCollectionScreen(MyCollectionMarketingHome) },
  MyProfile: { Component: MyProfileQueryRenderer },
  MyProfilePayment: { Component: MyProfilePaymentQueryRenderer },
  MyProfilePaymentNewCreditCard: { Component: MyProfilePaymentNewCreditCard },
  MyProfilePushNotifications: { Component: MyProfilePushNotificationsQueryRenderer },
  MySellingProfile: { Component: View },
  NewSubmissionForm: { Component: NewSubmissionForm },
  Partner: { Component: Partner, fullBleed: true },
  PartnerLocations: { Component: PartnerLocations },
  PrivacyRequest: { Component: PrivacyRequest },
  Sales: { Component: setupMyCollectionScreen(Consignments) },
  Search: { Component: SearchWithTracking },
  SellTabApp: { Component: setupMyCollectionScreen(SellTabApp) },
  Show: { Component: ShowQueryRenderer },
  ShowArtists: { Component: ShowArtists },
  ShowArtworks: { Component: ShowArtworks },
  ShowMoreInfo: { Component: ShowMoreInfo },
  VanityURLEntity: { Component: VanityURLEntityRenderer, fullBleed: true },
  ViewingRoom: { Component: ViewingRoomQueryRenderer, fullBleed: true },
  ViewingRoomArtwork: { Component: ViewingRoomArtworkQueryRenderer },
  ViewingRoomArtworks: { Component: ViewingRoomArtworksQueryRenderer },
  ViewingRooms: { Component: ViewingRoomsListQueryRenderer },
  WorksForYou: { Component: WorksForYouQueryRenderer },
})

for (const moduleName of Object.keys(modules)) {
  const descriptor = modules[moduleName as AppModule]
  register(moduleName, descriptor.Component, { fullBleed: descriptor.fullBleed })
}

const Main: React.FC<{}> = track()(({}) => {
  const isHydrated = AppStore.useAppState((state) => state.sessionState.isHydrated)
  const isLoggedIn = AppStore.useAppState((state) => !!state.native.sessionState.userID)
  const onboardingState = AppStore.useAppState((state) => state.native.sessionState.onboardingState)

  const screen = useScreenDimensions()
  if (!isHydrated) {
    return <View></View>
  }
  if (!isLoggedIn || onboardingState === "incomplete") {
    return <NativeViewController viewName="Onboarding" />
  }
  return (
    <View style={{ paddingBottom: screen.safeAreaInsets.bottom, flex: 1 }}>
      <View style={{ flexGrow: 1 }}>
        <NativeViewController viewName="Main" />
      </View>
      <BottomTabs />
    </View>
  )
})

AppRegistry.registerComponent("Main", () => () => {
  return (
    <AppStoreProvider>
      <ProvideScreenDimensions>
        <Main />
      </ProvideScreenDimensions>
    </AppStoreProvider>
  )
})
