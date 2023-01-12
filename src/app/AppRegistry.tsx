// keep this import of storybook first, otherwise it might produce errors when debugging
// import { StorybookUIRoot } from "../storybook/storybook-ui"

import { GoogleSignin } from "@react-native-google-signin/google-signin"
import { SafeAreaInsets } from "app/types/SafeAreaInsets"
import React, { useEffect } from "react"
import { AppRegistry, LogBox, Platform, View } from "react-native"
import { GraphQLTaggedNode } from "relay-runtime"
import { AppProviders } from "./AppProviders"
import { ArtsyKeyboardAvoidingViewContext } from "./Components/ArtsyKeyboardAvoidingView"
import { ArtsyReactWebViewPage, useWebViewCookies } from "./Components/ArtsyReactWebView"
import { FadeIn } from "./Components/FadeIn"
import { FPSCounter } from "./Components/FPSCounter"
import { BidFlow } from "./Containers/BidFlow"
import { InboxQueryRenderer, InboxScreenQuery } from "./Containers/Inbox"
import { InquiryQueryRenderer } from "./Containers/Inquiry"
import { RegistrationFlow } from "./Containers/RegistrationFlow"
import { WorksForYouQueryRenderer, WorksForYouScreenQuery } from "./Containers/WorksForYou"
import { useErrorReporting } from "./errorReporting/hooks"
import { CityGuideView } from "./NativeModules/CityGuideView"
import { usingNewIOSAppShell } from "./NativeModules/LegacyNativeModules"
import { LiveAuctionView } from "./NativeModules/LiveAuctionView"
import { About } from "./Scenes/About/About"
import { ArticlesScreen, ArticlesScreenQuery } from "./Scenes/Articles/Articles"
import { ArtistQueryRenderer, ArtistScreenQuery } from "./Scenes/Artist/Artist"
import { ArtistArticlesQueryRenderer } from "./Scenes/ArtistArticles/ArtistArticles"
import { ArtistSeriesQueryRenderer } from "./Scenes/ArtistSeries/ArtistSeries"
import { ArtistSeriesFullArtistSeriesListQueryRenderer } from "./Scenes/ArtistSeries/ArtistSeriesFullArtistSeriesList"
import { ArtistShows2QueryRenderer } from "./Scenes/ArtistShows/ArtistShows2"
import { ArtworkQueryRenderer, ArtworkScreenQuery } from "./Scenes/Artwork/Artwork"
import { ArtworkViewInRoom } from "./Scenes/Artwork/ArtworkViewInRoom"
import { ArtworkAttributionClassFAQQueryRenderer } from "./Scenes/ArtworkAttributionClassFAQ"
import { ArtworkMediumQueryRenderer } from "./Scenes/ArtworkMedium"
import { AuctionResultQueryRenderer } from "./Scenes/AuctionResult/AuctionResult"
import {
  AuctionResultsForArtistsYouFollowQueryRenderer,
  AuctionResultsForArtistsYouFollowScreenQuery,
} from "./Scenes/AuctionResultsForArtistsYouFollow/AuctionResultsForArtistsYouFollow"
import { BottomTabs } from "./Scenes/BottomTabs/BottomTabs"
import { BottomTabsNavigator } from "./Scenes/BottomTabs/BottomTabsNavigator"
import { BottomTabOption, BottomTabType } from "./Scenes/BottomTabs/BottomTabType"
import { CityView } from "./Scenes/City"
import { CityBMWListQueryRenderer } from "./Scenes/City/CityBMWList"
import { CityFairListQueryRenderer } from "./Scenes/City/CityFairList"
import { CityPicker } from "./Scenes/City/CityPicker"
import { CitySavedListQueryRenderer } from "./Scenes/City/CitySavedList"
import { CitySectionListQueryRenderer } from "./Scenes/City/CitySectionList"
import { CollectionQueryRenderer } from "./Scenes/Collection/Collection"
import { CollectionFullFeaturedArtistListQueryRenderer } from "./Scenes/Collection/Components/FullFeaturedArtistList"
import { Consignments } from "./Scenes/Consignments"
import { ConsignmentsHomeScreenQuery } from "./Scenes/Consignments/ConsignmentsHome/ConsignmentsHome"
import { ConsignmentsSubmissionForm } from "./Scenes/Consignments/ConsignmentsHome/ConsignmentsSubmissionForm"
import { FairQueryRenderer } from "./Scenes/Fair/Fair"
import { FairAllFollowedArtistsQueryRenderer } from "./Scenes/Fair/FairAllFollowedArtists"
import { FairArticlesQueryRenderer } from "./Scenes/Fair/FairArticles"
import { FairBMWArtActivationQueryRenderer } from "./Scenes/Fair/FairBMWArtActivation"
import { FairMoreInfoQueryRenderer } from "./Scenes/Fair/FairMoreInfo"
import { Favorites } from "./Scenes/Favorites/Favorites"
import { FeatureQueryRenderer } from "./Scenes/Feature/Feature"
import { ForceUpdate } from "./Scenes/ForceUpdate/ForceUpdate"
import { GeneQueryRenderer } from "./Scenes/Gene/Gene"
import { HomeQueryRenderer } from "./Scenes/Home/Home"
import { MakeOfferModalQueryRenderer } from "./Scenes/Inbox/Components/Conversations/MakeOfferModal"
import { ConversationNavigator } from "./Scenes/Inbox/ConversationNavigator"
import { ConversationDetailsQueryRenderer } from "./Scenes/Inbox/Screens/ConversationDetails"
import {
  LotsByArtistsYouFollowQueryRenderer,
  LotsByArtistsYouFollowScreenQuery,
} from "./Scenes/LotsByArtistsYouFollow/LotsByArtistsYouFollow"
import { MapContainer } from "./Scenes/Map"
import { NewMapScreen } from "./Scenes/Map/NewMap"
import { MyAccountQueryRenderer } from "./Scenes/MyAccount/MyAccount"
import { MyAccountEditEmailQueryRenderer } from "./Scenes/MyAccount/MyAccountEditEmail"
import { MyAccountEditNameQueryRenderer } from "./Scenes/MyAccount/MyAccountEditName"
import { MyAccountEditPassword } from "./Scenes/MyAccount/MyAccountEditPassword"
import { MyAccountEditPhoneQueryRenderer } from "./Scenes/MyAccount/MyAccountEditPhone"
import { MyBidsQueryRenderer } from "./Scenes/MyBids"
import {
  MyCollectionQueryRenderer,
  MyCollectionScreenQuery,
} from "./Scenes/MyCollection/MyCollection"
import { ArtworkSubmissionStatusFAQ } from "./Scenes/MyCollection/Screens/Artwork/ArtworkSubmissionStatusFAQ"
import { RequestForPriceEstimateScreen } from "./Scenes/MyCollection/Screens/Artwork/Components/ArtworkInsights/RequestForPriceEstimate/RequestForPriceEstimateScreen"
import { MyCollectionArtworkQueryRenderer } from "./Scenes/MyCollection/Screens/Artwork/MyCollectionArtwork"
import { MyCollectionSellingWithartsyFAQ } from "./Scenes/MyCollection/Screens/Artwork/MyCollectionSellingWithartsyFAQ"
import { MyCollectionArtworkForm } from "./Scenes/MyCollection/Screens/ArtworkForm/MyCollectionArtworkForm"
import { MyCollectionArtworkFullDetailsQueryRenderer } from "./Scenes/MyCollection/Screens/ArtworkFullDetails/MyCollectionArtworkFullDetails"
import { DarkModeSettings } from "./Scenes/MyProfile/DarkModeSettings"
import { MyProfile } from "./Scenes/MyProfile/MyProfile"
import { MyProfileHeaderMyCollectionAndSavedWorksScreenQuery } from "./Scenes/MyProfile/MyProfileHeaderMyCollectionAndSavedWorks"
import { MyProfilePaymentQueryRenderer } from "./Scenes/MyProfile/MyProfilePayment"
import { MyProfilePaymentNewCreditCard } from "./Scenes/MyProfile/MyProfilePaymentNewCreditCard"
import { MyProfilePushNotificationsQueryRenderer } from "./Scenes/MyProfile/MyProfilePushNotifications"
import { MyProfileSettings } from "./Scenes/MyProfile/MyProfileSettings"
import {
  NewWorksForYouQueryRenderer,
  NewWorksForYouScreenQuery,
} from "./Scenes/NewWorksForYou/NewWorksForYou"
import { Onboarding } from "./Scenes/Onboarding/Onboarding"
import { OrderDetailsQueryRender } from "./Scenes/OrderHistory/OrderDetails/Components/OrderDetails"
import { OrderHistoryQueryRender } from "./Scenes/OrderHistory/OrderHistory"
import { PartnerQueryRenderer } from "./Scenes/Partner"
import { PartnerLocationsQueryRenderer } from "./Scenes/Partner/Screens/PartnerLocations"
import { PrivacyRequest } from "./Scenes/PrivacyRequest"
import { SaleQueryRenderer, SaleScreenQuery } from "./Scenes/Sale"
import { SaleFAQ } from "./Scenes/SaleFAQ/SaleFAQ"
import { SaleInfoQueryRenderer } from "./Scenes/SaleInfo"
import { SalesQueryRenderer, SalesScreenQuery } from "./Scenes/Sales"
import { SavedAddressesQueryRenderer } from "./Scenes/SavedAddresses/SavedAddresses"
import { SavedAddressesFormQueryRenderer } from "./Scenes/SavedAddresses/SavedAddressesForm"
import { EditSavedSearchAlertQueryRenderer } from "./Scenes/SavedSearchAlert/EditSavedSearchAlert"
import { SavedSearchAlertsListQueryRenderer } from "./Scenes/SavedSearchAlertsList/SavedSearchAlertsList"
import { SearchScreen, SearchScreenQuery } from "./Scenes/Search/Search"
import { ShowMoreInfoQueryRenderer, ShowQueryRenderer } from "./Scenes/Show"
import { TagQueryRenderer } from "./Scenes/Tag/Tag"
import { VanityURLEntityRenderer } from "./Scenes/VanityURL/VanityURLEntity"
import { ViewingRoomQueryRenderer } from "./Scenes/ViewingRoom/ViewingRoom"
import { ViewingRoomArtworkScreen } from "./Scenes/ViewingRoom/ViewingRoomArtwork"
import { ViewingRoomArtworksQueryRenderer } from "./Scenes/ViewingRoom/ViewingRoomArtworks"
import {
  ViewingRoomsListScreen,
  ViewingRoomsListScreenQuery,
} from "./Scenes/ViewingRoom/ViewingRoomsList"
import { GlobalStore, useDevToggle, useSelectedTab } from "./store/GlobalStore"
import { propsStore } from "./store/PropsStore"
import { AdminMenu } from "./utils/AdminMenu"
import { useInitializeQueryPrefetching } from "./utils/queryPrefetching"
import { addTrackingProvider, Schema, screenTrack } from "./utils/track"
import { ConsoleTrackingProvider } from "./utils/track/ConsoleTrackingProvider"
import {
  SEGMENT_TRACKING_PROVIDER,
  SegmentTrackingProvider,
} from "./utils/track/SegmentTrackingProvider"
import { useDebugging } from "./utils/useDebugging"
import { useFreshInstallTracking } from "./utils/useFreshInstallTracking"
import { useIdentifyUser } from "./utils/useIdentifyUser"
import { usePreferredThemeTracking } from "./utils/usePreferredThemeTracking"
import { useScreenDimensions } from "./utils/useScreenDimensions"
import { useScreenReaderTracking } from "./utils/useScreenReaderTracking"
import { useStripeConfig } from "./utils/useStripeConfig"
import useSyncNativeAuthState from "./utils/useSyncAuthState"

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",

  "Require cycle:",

  ".removeListener(", // this is coming from https://github.com/facebook/react-native/blob/v0.68.0-rc.2/Libraries/AppState/AppState.js and other libs.
])

addTrackingProvider(SEGMENT_TRACKING_PROVIDER, SegmentTrackingProvider)
addTrackingProvider("console", ConsoleTrackingProvider)

interface ArtworkProps {
  artworkID: string
  isVisible: boolean
}

const Artwork = (props: ArtworkProps) => <ArtworkQueryRenderer {...props} />

interface PartnerLocationsProps {
  partnerID: string
  safeAreaInsets: SafeAreaInsets
  isVisible: boolean
}
const PartnerLocations = (props: PartnerLocationsProps) => (
  <PartnerLocationsQueryRenderer {...props} />
)

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

interface PageWrapperProps {
  fullBleed?: boolean
  isMainView?: boolean
  ignoreTabs?: boolean
  ViewComponent: React.ComponentType<any>
  viewProps: any
  moduleName: string
}

const InnerPageWrapper: React.FC<PageWrapperProps> = ({
  fullBleed,
  isMainView,
  ignoreTabs = false,
  ViewComponent,
  viewProps,
}) => {
  const safeAreaInsets = useScreenDimensions().safeAreaInsets
  const paddingTop = fullBleed ? 0 : safeAreaInsets.top
  const paddingBottom = isMainView ? 0 : safeAreaInsets.bottom
  const isHydrated = GlobalStore.useAppState((state) => state.sessionState.isHydrated)
  // if we're in a modal, just pass isVisible through

  let isVisible = viewProps.isVisible
  if (!ignoreTabs) {
    const currentTab = useSelectedTab()
    if (BottomTabOption[viewProps.navStackID as BottomTabType]) {
      // otherwise, make sure it respects the current tab
      isVisible = isVisible && currentTab === viewProps.navStackID
    }
  }

  const isPresentedModally = viewProps.isPresentedModally
  return (
    <ArtsyKeyboardAvoidingViewContext.Provider
      value={{ isVisible, isPresentedModally, bottomOffset: paddingBottom }}
    >
      <View style={{ flex: 1, paddingTop, paddingBottom }}>
        {isHydrated ? (
          <FadeIn style={{ flex: 1 }} slide={false}>
            <ViewComponent {...{ ...viewProps, isVisible }} />
          </FadeIn>
        ) : null}
      </View>
    </ArtsyKeyboardAvoidingViewContext.Provider>
  )
}

class PageWrapper extends React.Component<PageWrapperProps> {
  pageProps: PageWrapperProps

  constructor(props: PageWrapperProps) {
    super(props)
    this.pageProps = this.savePageProps()
  }

  componentDidUpdate() {
    if (this.props.moduleName === "Map") {
      // workaround for City Guide. DO NOT USE FOR OTHER THINGS!
      // basically, only for the city guide component, we recreate the pageprops fresh.
      // thats because of the funky way the native and RN components in city guide are set up.
      // if we dont refresh them, then the city guide does not change cities from the dropdown.
      this.pageProps = this.savePageProps()
    }
  }

  savePageProps() {
    return {
      ...this.props,
      viewProps: {
        ...this.props.viewProps,
        ...propsStore.getPropsForModule(this.props.moduleName),
      },
    }
  }

  render() {
    return (
      <AppProviders>
        <InnerPageWrapper {...this.pageProps} />
      </AppProviders>
    )
  }
}

function register(
  screenName: string,
  Component: React.ComponentType<any>,
  options?: Omit<PageWrapperProps, "ViewComponent" | "viewProps">
) {
  const WrappedComponent = (props: any) => (
    <PageWrapper {...options} moduleName={screenName} ViewComponent={Component} viewProps={props} />
  )
  AppRegistry.registerComponent(screenName, () => WrappedComponent)
}

export interface ViewOptions {
  modalPresentationStyle?: "fullScreen" | "pageSheet" | "formSheet"
  hasOwnModalCloseButton?: boolean
  alwaysPresentModally?: boolean
  hidesBackButton?: boolean
  fullBleed?: boolean
  ignoreTabs?: boolean
  // If this module is the root view of a particular tab, name it here
  isRootViewForTabName?: BottomTabType
  // If this module should only be shown in one particular tab, name it here
  onlyShowInTabName?: BottomTabType
}

type ModuleDescriptor =
  | {
      type: "react"
      Component: React.ComponentType<any>
      Queries?: GraphQLTaggedNode[]
      options: ViewOptions
    }
  | {
      type: "native"
      options: ViewOptions
    }
  | {
      type: "new_native"
      Component: React.ComponentType<any>
      Query?: GraphQLTaggedNode
      options: ViewOptions
    }

function reactModule(
  Component: React.ComponentType<any>,
  options: ViewOptions = {},
  Queries?: GraphQLTaggedNode[]
): ModuleDescriptor {
  return { type: "react", options, Component, Queries }
}

function newNativeModule(
  Component: React.ComponentType<any>,
  options: ViewOptions = {},
  Query?: GraphQLTaggedNode
): ModuleDescriptor {
  return { type: "new_native", options, Component, Query }
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
  // Storybook: reactModule(StorybookUIRoot, { fullBleed: true, hidesBackButton: true }),
  Admin: nativeModule({ alwaysPresentModally: true }),
  Admin2: reactModule(AdminMenu, { alwaysPresentModally: true, hasOwnModalCloseButton: true }),
  About: reactModule(About),
  AddOrEditMyCollectionArtwork: reactModule(MyCollectionArtworkForm, { hidesBackButton: true }),
  Articles: reactModule(ArticlesScreen, {}, [ArticlesScreenQuery]),
  Artist: reactModule(ArtistQueryRenderer, { hidesBackButton: true }, [ArtistScreenQuery]),
  ArtistShows: reactModule(ArtistShows2QueryRenderer),
  ArtistArticles: reactModule(ArtistArticlesQueryRenderer),
  ArtistSeries: reactModule(ArtistSeriesQueryRenderer),
  Artwork: reactModule(Artwork, {}, [ArtworkScreenQuery]),
  ArtworkMedium: reactModule(ArtworkMediumQueryRenderer),
  ArtworkAttributionClassFAQ: reactModule(ArtworkAttributionClassFAQQueryRenderer),
  ArtworkSubmissionStatusFAQ: reactModule(ArtworkSubmissionStatusFAQ),
  ArtworkViewInRoom: reactModule(ArtworkViewInRoom),
  Auction: reactModule(SaleQueryRenderer, { fullBleed: true }, [SaleScreenQuery]),
  Auctions: reactModule(SalesQueryRenderer, {}, [SalesScreenQuery]),
  AuctionInfo: reactModule(SaleInfoQueryRenderer),
  AuctionFAQ: reactModule(SaleFAQ),
  AuctionResult: reactModule(AuctionResultQueryRenderer),
  AuctionResultsForArtistsYouFollow: reactModule(
    AuctionResultsForArtistsYouFollowQueryRenderer,
    {},
    [AuctionResultsForArtistsYouFollowScreenQuery]
  ),
  AuctionRegistration: reactModule(RegistrationFlow, {
    alwaysPresentModally: true,
    hasOwnModalCloseButton: true,
    fullBleed: true,
  }),
  AuctionBidArtwork: reactModule(BidFlow, {
    alwaysPresentModally: true,
    hasOwnModalCloseButton: true,
    fullBleed: true,
  }),
  BottomTabs: reactModule(BottomTabs, { fullBleed: true }),
  City: reactModule(CityView, { fullBleed: true, ignoreTabs: true }),
  CityBMWList: reactModule(CityBMWListQueryRenderer, { fullBleed: true }),
  CityFairList: reactModule(CityFairListQueryRenderer, { fullBleed: true }),
  CityPicker: reactModule(CityPicker, { fullBleed: true, ignoreTabs: true }),
  CitySavedList: reactModule(CitySavedListQueryRenderer),
  CitySectionList: reactModule(CitySectionListQueryRenderer),
  Collection: reactModule(CollectionQueryRenderer, { fullBleed: true }),
  ConsignmentsSubmissionForm: reactModule(ConsignmentsSubmissionForm, { hidesBackButton: true }),
  Conversation: reactModule(Conversation, { onlyShowInTabName: "inbox" }),
  ConversationDetails: reactModule(ConversationDetailsQueryRenderer),
  Fair: reactModule(FairQueryRenderer, { fullBleed: true }),
  FairMoreInfo: reactModule(FairMoreInfoQueryRenderer),
  FairArticles: reactModule(FairArticlesQueryRenderer),
  FairAllFollowedArtists: reactModule(FairAllFollowedArtistsQueryRenderer),
  FairBMWArtActivation: reactModule(FairBMWArtActivationQueryRenderer, { fullBleed: true }),
  Favorites: reactModule(Favorites),
  Feature: reactModule(FeatureQueryRenderer, { fullBleed: true }),
  FullArtistSeriesList: reactModule(ArtistSeriesFullArtistSeriesListQueryRenderer),
  FullFeaturedArtistList: reactModule(CollectionFullFeaturedArtistListQueryRenderer),
  Gene: reactModule(GeneQueryRenderer),
  Tag: reactModule(TagQueryRenderer),
  Home: reactModule(HomeQueryRenderer, { isRootViewForTabName: "home" }),
  Inbox: reactModule(InboxQueryRenderer, { isRootViewForTabName: "inbox" }, [InboxScreenQuery]),
  Inquiry: reactModule(Inquiry, { alwaysPresentModally: true, hasOwnModalCloseButton: true }),
  LiveAuction: newNativeModule(LiveAuctionView, {
    alwaysPresentModally: true,
    hasOwnModalCloseButton: true,
    modalPresentationStyle: "fullScreen",
  }),
  LocalDiscovery: newNativeModule(CityGuideView, {
    fullBleed: true,
  }),
  ReactWebView: reactModule(ArtsyReactWebViewPage, {
    fullBleed: true,
    hasOwnModalCloseButton: true,
    hidesBackButton: true,
  }),
  MakeOfferModal: reactModule(MakeOfferModalQueryRenderer, {
    hasOwnModalCloseButton: true,
  }),
  Map: reactModule(MapContainer, { fullBleed: true }),
  NewMap: reactModule(NewMapScreen, { fullBleed: true }),
  MyAccount: reactModule(MyAccountQueryRenderer),
  MyAccountEditEmail: reactModule(MyAccountEditEmailQueryRenderer, { hidesBackButton: true }),
  MyAccountEditName: reactModule(MyAccountEditNameQueryRenderer, { hidesBackButton: true }),
  MyAccountEditPassword: reactModule(MyAccountEditPassword, { hidesBackButton: true }),
  MyAccountEditPhone: reactModule(MyAccountEditPhoneQueryRenderer, { hidesBackButton: true }),
  MyBids: reactModule(MyBidsQueryRenderer),
  MyCollection: reactModule(MyCollectionQueryRenderer),
  MyCollectionArtwork: reactModule(MyCollectionArtworkQueryRenderer, { hidesBackButton: true }),
  MyCollectionArtworkFullDetails: reactModule(MyCollectionArtworkFullDetailsQueryRenderer),
  MyCollectionSellingWithartsyFAQ: reactModule(MyCollectionSellingWithartsyFAQ),
  MyProfile: reactModule(
    MyProfile,
    {
      isRootViewForTabName: "profile",
    },
    [MyProfileHeaderMyCollectionAndSavedWorksScreenQuery, MyCollectionScreenQuery]
  ),
  MyProfilePayment: reactModule(MyProfilePaymentQueryRenderer),
  MyProfileSettings: reactModule(MyProfileSettings),
  OrderHistory: reactModule(OrderHistoryQueryRender),
  OrderDetails: reactModule(OrderDetailsQueryRender),
  MyProfilePaymentNewCreditCard: reactModule(MyProfilePaymentNewCreditCard, {
    hidesBackButton: true,
  }),
  MyProfilePushNotifications: reactModule(MyProfilePushNotificationsQueryRenderer),
  DarkModeSettings: reactModule(DarkModeSettings),
  MySellingProfile: reactModule(View),
  Partner: reactModule(PartnerQueryRenderer),
  PartnerLocations: reactModule(PartnerLocations),
  PrivacyRequest: reactModule(PrivacyRequest),
  RequestForPriceEstimateScreen: reactModule(RequestForPriceEstimateScreen),
  Sales: reactModule(Consignments, { isRootViewForTabName: "sell" }, [ConsignmentsHomeScreenQuery]),
  SalesNotRootTabView: reactModule(Consignments),
  Search: reactModule(SearchScreen, { isRootViewForTabName: "search" }, [SearchScreenQuery]),
  Show: reactModule(ShowQueryRenderer, { fullBleed: true }),
  ShowMoreInfo: reactModule(ShowMoreInfoQueryRenderer),
  SavedAddresses: reactModule(SavedAddressesQueryRenderer),
  SavedAddressesForm: reactModule(SavedAddressesFormQueryRenderer, {
    alwaysPresentModally: true,
    hasOwnModalCloseButton: false,
  }),
  VanityURLEntity: reactModule(VanityURLEntityRenderer, { fullBleed: true }),
  ViewingRoom: reactModule(ViewingRoomQueryRenderer, { fullBleed: true }),
  ViewingRoomArtwork: reactModule(ViewingRoomArtworkScreen),
  ViewingRoomArtworks: reactModule(ViewingRoomArtworksQueryRenderer),
  ViewingRooms: reactModule(ViewingRoomsListScreen, {}, [ViewingRoomsListScreenQuery]),
  WorksForYou: reactModule(WorksForYouQueryRenderer, {}, [WorksForYouScreenQuery]),
  NewWorksForYou: reactModule(NewWorksForYouQueryRenderer, {}, [NewWorksForYouScreenQuery]),
  LotsByArtistsYouFollow: reactModule(LotsByArtistsYouFollowQueryRenderer, {}, [
    LotsByArtistsYouFollowScreenQuery,
  ]),
  SavedSearchAlertsList: reactModule(SavedSearchAlertsListQueryRenderer),
  EditSavedSearchAlert: reactModule(EditSavedSearchAlertQueryRenderer),
})

// Register react modules with the app registry
for (const moduleName of Object.keys(modules)) {
  const descriptor = modules[moduleName as AppModule]
  if ("Component" in descriptor && descriptor.type !== "new_native") {
    if (Platform.OS === "ios") {
      register(moduleName, descriptor.Component, {
        fullBleed: descriptor.options.fullBleed,
        ignoreTabs: descriptor.options.ignoreTabs,
        moduleName,
      })
    }
  }
}

const Main: React.FC = () => {
  useDebugging()
  usePreferredThemeTracking()
  useScreenReaderTracking()
  useFreshInstallTracking()
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: "673710093763-hbj813nj4h3h183c4ildmu8vvqc0ek4h.apps.googleusercontent.com",
    })
  }, [])

  const isHydrated = GlobalStore.useAppState((state) => state.sessionState.isHydrated)
  const isLoggedIn = GlobalStore.useAppState((store) => store.auth.userAccessToken)

  const onboardingState = GlobalStore.useAppState((state) => state.auth.onboardingState)
  const forceUpdateMessage = GlobalStore.useAppState(
    (state) => state.artsyPrefs.echo.forceUpdateMessage
  )

  const fpsCounter = useDevToggle("DTFPSCounter")
  useErrorReporting()
  useStripeConfig()
  useWebViewCookies()
  useInitializeQueryPrefetching()
  useIdentifyUser()
  useSyncNativeAuthState()

  if (!isHydrated) {
    return <View />
  }

  if (forceUpdateMessage) {
    return <ForceUpdate forceUpdateMessage={forceUpdateMessage} />
  }

  if (!isLoggedIn || onboardingState === "incomplete") {
    return <Onboarding />
  }

  return (
    <>
      <BottomTabsNavigator />
      {!!fpsCounter && <FPSCounter style={{ bottom: 94 }} />}
    </>
  )
}

if (Platform.OS === "ios" && !usingNewIOSAppShell()) {
  register("Artsy", Main, { fullBleed: true, isMainView: true, moduleName: "Artsy" })
}
