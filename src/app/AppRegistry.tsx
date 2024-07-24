import { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { BidFlow } from "app/Components/Containers/BidFlow"
import { InboxQueryRenderer, InboxScreenQuery } from "app/Components/Containers/Inbox"
import { InquiryQueryRenderer } from "app/Components/Containers/Inquiry"
import { RegistrationFlow } from "app/Components/Containers/RegistrationFlow"
import {
  WorksForYouQueryRenderer,
  WorksForYouScreenQuery,
} from "app/Components/Containers/WorksForYou"
import { FadeIn } from "app/Components/FadeIn"
import { ActivityItemScreenQueryRenderer } from "app/Scenes/Activity/ActivityItemScreen"
import { ArtQuiz } from "app/Scenes/ArtQuiz/ArtQuiz"
import { ArtQuizResults } from "app/Scenes/ArtQuiz/ArtQuizResults/ArtQuizResults"
import { ArticleScreen } from "app/Scenes/Article/ArticleScreen"
import { ArticlesSlideShowScreen } from "app/Scenes/ArticleSlideShow/ArticleSlideShow"
import { NewsScreen, NewsScreenQuery } from "app/Scenes/Articles/News/News"
import { BrowseSimilarWorksQueryRenderer } from "app/Scenes/Artwork/Components/BrowseSimilarWorks/BrowseSimilarWorks"
import { ArtworkListScreen } from "app/Scenes/ArtworkList/ArtworkList"
import { ArtworkRecommendationsScreen } from "app/Scenes/ArtworkRecommendations/ArtworkRecommendations"
import { GalleriesForYouScreen } from "app/Scenes/GalleriesForYou/GalleriesForYouScreen"
import { HomeContainer } from "app/Scenes/Home/HomeContainer"
import { AddMyCollectionArtist } from "app/Scenes/MyCollection/Screens/Artist/AddMyCollectionArtist"
import { MyCollectionArtworkEditQueryRenderer } from "app/Scenes/MyCollection/Screens/ArtworkForm/Screens/MyCollectionArtworkEdit"
import { MyCollectionCollectedArtistsPrivacyQueryRenderer } from "app/Scenes/MyCollection/Screens/CollectedArtistsPrivacy/MyCollectionCollectedArtistsPrivacy"
import { MyCollectionAddCollectedArtistsScreen } from "app/Scenes/MyCollection/Screens/MyCollectionAddCollectedArtists/MyCollectionAddCollectedArtists"
import { NewWorksFromGalleriesYouFollowScreen } from "app/Scenes/NewWorksFromGalleriesYouFollow/NewWorksFromGalleriesYouFollow"
import { PartnerOfferContainer } from "app/Scenes/PartnerOffer/PartnerOfferContainer"
import { PriceDatabase } from "app/Scenes/PriceDatabase/PriceDatabase"
import { RecentlyViewedScreenQuery } from "app/Scenes/RecentlyViewed/Components/RecentlyViewedArtworks"
import { RecentlyViewedScreen } from "app/Scenes/RecentlyViewed/RecentlyViewed"
import { SavedArtworks } from "app/Scenes/SavedArtworks/SavedArtworks"
import { AlertArtworks } from "app/Scenes/SavedSearchAlert/AlertArtworks"
import { SearchScreen, SearchScreenQuery } from "app/Scenes/Search/Search"
import { SubmitArtworkForm } from "app/Scenes/SellWithArtsy/ArtworkForm/SubmitArtworkForm"
import { SubmitArtworkFormEdit } from "app/Scenes/SellWithArtsy/ArtworkForm/SubmitArtworkFormEdit"
import { SimilarToRecentlyViewedScreen } from "app/Scenes/SimilarToRecentlyViewed/SimilarToRecentlyViewed"
import { ArtsyKeyboardAvoidingViewContext } from "app/utils/ArtsyKeyboardAvoidingView"
import { SafeAreaInsets, useScreenDimensions } from "app/utils/hooks"
import { useSelectedTab } from "app/utils/hooks/useSelectedTab"
import React from "react"
import { AppRegistry, LogBox, Platform, View } from "react-native"
import { GraphQLTaggedNode } from "react-relay"
import { ArtsyWebViewPage } from "./Components/ArtsyWebView"
import { CityGuideView } from "./NativeModules/CityGuideView"
import { LiveAuctionView } from "./NativeModules/LiveAuctionView"
import { Providers } from "./Providers"
import { About } from "./Scenes/About/About"
import { ActivityScreen } from "./Scenes/Activity/ActivityScreen"
import { ArticlesScreen, ArticlesScreenQuery } from "./Scenes/Articles/Articles"
import { ArtistQueryRenderer, ArtistScreenQuery } from "./Scenes/Artist/Artist"
import { ArtistArticlesQueryRenderer } from "./Scenes/ArtistArticles/ArtistArticles"
import { ArtistSeriesQueryRenderer } from "./Scenes/ArtistSeries/ArtistSeries"
import { ArtistSeriesFullArtistSeriesListQueryRenderer } from "./Scenes/ArtistSeries/ArtistSeriesFullArtistSeriesList"
import { ArtistShows2QueryRenderer } from "./Scenes/ArtistShows/ArtistShows2"
import { ArtworkScreen, ArtworkScreenQuery } from "./Scenes/Artwork/Artwork"
import { CertificateOfAuthenticity } from "./Scenes/Artwork/Components/CertificateAuthenticity"
import { UnlistedArtworksFAQScreen } from "./Scenes/Artwork/Components/UnlistedArtworksFAQScreen"
import { ArtworkAttributionClassFAQQueryRenderer } from "./Scenes/ArtworkAttributionClassFAQ/ArtworkAttributionClassFAQ"
import { ArtworkMediumQueryRenderer } from "./Scenes/ArtworkMedium/ArtworkMedium"
import { AuctionBuyersPremiumQueryRenderer } from "./Scenes/AuctionBuyersPremium/AuctionBuyersPremium"
import { AuctionResultQueryRenderer } from "./Scenes/AuctionResult/AuctionResult"
import {
  AuctionResultsForArtistsYouFollowPrefetchQuery,
  AuctionResultsForArtistsYouFollowQueryRenderer,
} from "./Scenes/AuctionResults/AuctionResultsForArtistsYouFollow"
import { BottomTabOption, BottomTabType } from "./Scenes/BottomTabs/BottomTabType"
import { BottomTabs } from "./Scenes/BottomTabs/BottomTabs"
import { CityView } from "./Scenes/City/City"
import { CityFairListQueryRenderer } from "./Scenes/City/CityFairList"
import { CityPicker } from "./Scenes/City/CityPicker"
import { CitySavedListQueryRenderer } from "./Scenes/City/CitySavedList"
import { CitySectionListQueryRenderer } from "./Scenes/City/CitySectionList"
import { CollectionQueryRenderer } from "./Scenes/Collection/Collection"
import { CollectionFullFeaturedArtistListQueryRenderer } from "./Scenes/Collection/Components/FullFeaturedArtistList"
import { FairQueryRenderer } from "./Scenes/Fair/Fair"
import { FairAllFollowedArtistsQueryRenderer } from "./Scenes/Fair/FairAllFollowedArtists"
import { FairArticlesQueryRenderer } from "./Scenes/Fair/FairArticles"
import { FairMoreInfoQueryRenderer } from "./Scenes/Fair/FairMoreInfo"
import { Favorites } from "./Scenes/Favorites/Favorites"
import { FeatureQueryRenderer } from "./Scenes/Feature/Feature"
import { GeneQueryRenderer } from "./Scenes/Gene/Gene"
import { MakeOfferModalQueryRenderer } from "./Scenes/Inbox/Components/Conversations/MakeOfferModal"
import { PurchaseModalQueryRenderer } from "./Scenes/Inbox/Components/Conversations/PurchaseModal"
import { ConversationNavigator } from "./Scenes/Inbox/ConversationNavigator"
import { ConversationDetailsQueryRenderer } from "./Scenes/Inbox/Screens/ConversationDetails"
import { MapContainer } from "./Scenes/Map/MapContainer"
import { MyAccountQueryRenderer } from "./Scenes/MyAccount/MyAccount"
import { MyAccountDeleteAccountQueryRenderer } from "./Scenes/MyAccount/MyAccountDeleteAccount"
import { MyAccountEditEmailQueryRenderer } from "./Scenes/MyAccount/MyAccountEditEmail"
import { MyAccountEditPassword } from "./Scenes/MyAccount/MyAccountEditPassword"
import { MyAccountEditPhoneQueryRenderer } from "./Scenes/MyAccount/MyAccountEditPhone"
import { MyAccountEditPriceRangeQueryRenderer } from "./Scenes/MyAccount/MyAccountEditPriceRange"
import { MyBidsQueryRenderer } from "./Scenes/MyBids/MyBids"
import {
  MyCollectionQueryRenderer,
  MyCollectionScreenQuery,
} from "./Scenes/MyCollection/MyCollection"
import { RequestForPriceEstimateConfirmationScreen } from "./Scenes/MyCollection/Screens/Artwork/Components/ArtworkInsights/RequestForPriceEstimate/RequestForPriceEstimateConfirmationScreen"
import { RequestForPriceEstimateScreen } from "./Scenes/MyCollection/Screens/Artwork/Components/ArtworkInsights/RequestForPriceEstimate/RequestForPriceEstimateScreen"
import {
  MyCollectionArtworkScreen,
  MyCollectionArtworkScreenQuery,
} from "./Scenes/MyCollection/Screens/Artwork/MyCollectionArtwork"
import { MyCollectionSellingWithArtsyFAQ } from "./Scenes/MyCollection/Screens/Artwork/MyCollectionSellingWithartsyFAQ"
import { MyCollectionArtworkAdd } from "./Scenes/MyCollection/Screens/ArtworkForm/MyCollectionArtworkForm"
import { AuctionResultsForArtistsYouCollect } from "./Scenes/MyCollection/Screens/Insights/AuctionResultsForArtistsYouCollect"
import { CareerHighlightsBigCardsSwiper } from "./Scenes/MyCollection/Screens/Insights/CareerHighlightsBigCardsSwiper"
import { MedianSalePriceAtAuction } from "./Scenes/MyCollection/Screens/Insights/MedianSalePriceAtAuction"
import { DarkModeSettings } from "./Scenes/MyProfile/DarkModeSettings"
import { MyProfile } from "./Scenes/MyProfile/MyProfile"
import { MyProfileEditFormScreen } from "./Scenes/MyProfile/MyProfileEditForm"
import { MyProfilePaymentQueryRenderer } from "./Scenes/MyProfile/MyProfilePayment"
import { MyProfilePaymentNewCreditCard } from "./Scenes/MyProfile/MyProfilePaymentNewCreditCard"
import { MyProfilePushNotificationsQueryRenderer } from "./Scenes/MyProfile/MyProfilePushNotifications"
import { MyProfileSettings } from "./Scenes/MyProfile/MyProfileSettings"
import { NewWorksForYouQueryRenderer } from "./Scenes/NewWorksForYou/NewWorksForYou"
import { OrderDetailsQueryRender } from "./Scenes/OrderHistory/OrderDetails/Components/OrderDetails"
import { OrderHistoryQueryRender } from "./Scenes/OrderHistory/OrderHistory"
import { PartnerQueryRenderer } from "./Scenes/Partner/Partner"
import { PartnerLocationsQueryRenderer } from "./Scenes/Partner/Screens/PartnerLocations"
import { PrivacyRequest } from "./Scenes/PrivacyRequest/PrivacyRequest"
import { RecommendedAuctionLotsQueryRenderer } from "./Scenes/RecommendedAuctionLots/RecommendedAuctionLots"
import { SaleQueryRenderer, SaleScreenQuery } from "./Scenes/Sale/Sale"
import { SaleInfoQueryRenderer } from "./Scenes/SaleInfo/SaleInfo"
import { SalesScreen, SalesScreenQuery } from "./Scenes/Sales/Sales"
import { EditSavedSearchAlertQueryRenderer } from "./Scenes/SavedSearchAlert/EditSavedSearchAlert"
import { SavedSearchAlertsListQueryRenderer } from "./Scenes/SavedSearchAlertsList/SavedSearchAlertsList"
import { ConsignmentInquiryScreen } from "./Scenes/SellWithArtsy/ConsignmentInquiry/ConsignmentInquiryScreen"
import { SellWithArtsyHomeScreenQuery } from "./Scenes/SellWithArtsy/SellWithArtsyHome"
import { SubmitArtwork } from "./Scenes/SellWithArtsy/SubmitArtwork/SubmitArtwork"
import { SellWithArtsy } from "./Scenes/SellWithArtsy/SubmitArtwork/UploadPhotos/utils"
import { ShowMoreInfoQueryRenderer } from "./Scenes/Show/Screens/ShowMoreInfo"
import { ShowQueryRenderer } from "./Scenes/Show/Show"
import { TagQueryRenderer } from "./Scenes/Tag/Tag"
import { VanityURLEntityRenderer } from "./Scenes/VanityURL/VanityURLEntity"
import { ViewingRoomQueryRenderer } from "./Scenes/ViewingRoom/ViewingRoom"
import { ViewingRoomArtworkScreen } from "./Scenes/ViewingRoom/ViewingRoomArtwork"
import { ViewingRoomArtworksQueryRenderer } from "./Scenes/ViewingRoom/ViewingRoomArtworks"
import {
  ViewingRoomsListScreen,
  viewingRoomsListScreenQuery,
} from "./Scenes/ViewingRoom/ViewingRoomsList"
import { GlobalStore, unsafe_getFeatureFlag } from "./store/GlobalStore"
import { propsStore } from "./store/PropsStore"
import { DevMenu } from "./system/devTools/DevMenu/DevMenu"
import { Schema, screenTrack } from "./utils/track"

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",

  "Require cycle:",

  ".removeListener(", // this is coming from https://github.com/facebook/react-native/blob/v0.68.0-rc.2/Libraries/AppState/AppState.js and other libs.
])

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
    // eslint-disable-next-line react-hooks/rules-of-hooks
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
      <Providers>
        <InnerPageWrapper {...this.pageProps} />
      </Providers>
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
  hidesBottomTabs?: boolean
  fullBleed?: boolean
  ignoreTabs?: boolean
  // If this module is the root view of a particular tab, name it here
  isRootViewForTabName?: BottomTabType
  // If this module should only be shown in one particular tab, name it here
  onlyShowInTabName?: BottomTabType
  screenOptions?: NativeStackNavigationOptions
}

type ModuleDescriptor = {
  type: "react"
  Component: React.ComponentType<any>
  Queries?: GraphQLTaggedNode[]
  options: ViewOptions
}

function reactModule(
  Component: React.ComponentType<any>,
  options: ViewOptions = {},
  Queries?: GraphQLTaggedNode[]
): ModuleDescriptor {
  return { type: "react", options, Component, Queries }
}

// little helper function to make sure we get both intellisense and good type information on the result
function defineModules<T extends string>(obj: Record<T, ModuleDescriptor>) {
  return obj
}

const artQuizScreenOptions = {
  hidesBackButton: true,
  fullBleed: true,
  screenOptions: {
    gestureEnabled: false,
  },
}

export type AppModule = keyof typeof modules

export const modules = defineModules({
  Activity: reactModule(ActivityScreen, {
    fullBleed: true,
    hidesBackButton: true,
    hidesBottomTabs: true,
  }),
  ActivityItem: reactModule(ActivityItemScreenQueryRenderer, {
    fullBleed: true,
    hidesBackButton: true,
    hidesBottomTabs: true,
  }),
  About: reactModule(About),
  AddMyCollectionArtist: reactModule(AddMyCollectionArtist, {
    hidesBackButton: true,
  }),
  AlertArtworks: reactModule(AlertArtworks, {
    fullBleed: true,
    hidesBackButton: true,
    hidesBottomTabs: true,
  }),
  ArtQuiz: reactModule(ArtQuiz, { ...artQuizScreenOptions, hidesBottomTabs: true }),
  ArtQuizResults: reactModule(ArtQuizResults, {
    fullBleed: true,
    hidesBackButton: true,
  }),
  Article: reactModule(ArticleScreen, {
    fullBleed: true,
    hidesBackButton: true,
  }),
  ArticleSlideShow: reactModule(ArticlesSlideShowScreen, {
    fullBleed: true,
    hidesBackButton: true,
    hidesBottomTabs: true,
  }),
  Articles: reactModule(
    ArticlesScreen,
    {
      fullBleed: true,
      hidesBackButton: true,
    },
    [ArticlesScreenQuery]
  ),
  Artist: reactModule(ArtistQueryRenderer, { fullBleed: true, hidesBackButton: true }, [
    ArtistScreenQuery,
  ]),
  ArtistShows: reactModule(ArtistShows2QueryRenderer),
  ArtistArticles: reactModule(ArtistArticlesQueryRenderer),
  ArtistSeries: reactModule(ArtistSeriesQueryRenderer, {
    fullBleed: true,
    hidesBackButton: true,
  }),
  Artwork: reactModule(
    ArtworkScreen,
    {
      hidesBackButton: true,
      hidesBottomTabs: true,
    },
    [ArtworkScreenQuery]
  ),
  ArtworkMedium: reactModule(ArtworkMediumQueryRenderer, {
    fullBleed: true,
    alwaysPresentModally: true,
    modalPresentationStyle: "fullScreen",
  }),
  ArtworkAttributionClassFAQ: reactModule(ArtworkAttributionClassFAQQueryRenderer, {
    fullBleed: true,
    alwaysPresentModally: true,
    modalPresentationStyle: "fullScreen",
  }),
  ArtworkCertificateAuthenticity: reactModule(CertificateOfAuthenticity, {
    fullBleed: true,
    alwaysPresentModally: true,
    modalPresentationStyle: "fullScreen",
  }),
  ArtworkList: reactModule(ArtworkListScreen, { hidesBackButton: true }),
  ArtworkRecommendations: reactModule(ArtworkRecommendationsScreen),
  Auction: reactModule(SaleQueryRenderer, { fullBleed: true }, [SaleScreenQuery]),
  Auctions: reactModule(
    SalesScreen,
    {
      hidesBackButton: true,
      fullBleed: true,
    },
    [SalesScreenQuery]
  ),
  AuctionInfo: reactModule(SaleInfoQueryRenderer),
  AuctionResult: reactModule(AuctionResultQueryRenderer, { hidesBackButton: true }),
  AuctionResultsForArtistsYouFollow: reactModule(
    AuctionResultsForArtistsYouFollowQueryRenderer,
    {},
    [AuctionResultsForArtistsYouFollowPrefetchQuery]
  ),
  AuctionResultsForArtistsYouCollect: reactModule(AuctionResultsForArtistsYouCollect),
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
  AuctionBuyersPremium: reactModule(AuctionBuyersPremiumQueryRenderer, {
    fullBleed: true,
    alwaysPresentModally: true,
    modalPresentationStyle: "fullScreen",
  }),
  BottomTabs: reactModule(BottomTabs, { fullBleed: true }),
  BrowseSimilarWorks: reactModule(BrowseSimilarWorksQueryRenderer, {
    hidesBackButton: true,
    hidesBottomTabs: true,
  }),
  CareerHighlightsBigCardsSwiper: reactModule(CareerHighlightsBigCardsSwiper, {
    alwaysPresentModally: true,
    hidesBackButton: true,
    fullBleed: true,
  }),
  City: reactModule(CityView, { fullBleed: true, ignoreTabs: true }),
  CityFairList: reactModule(CityFairListQueryRenderer, { fullBleed: true }),
  CityPicker: reactModule(CityPicker, { fullBleed: true, ignoreTabs: true }),
  CitySavedList: reactModule(CitySavedListQueryRenderer),
  CitySectionList: reactModule(CitySectionListQueryRenderer),
  Collection: reactModule(CollectionQueryRenderer, { fullBleed: true, hidesBackButton: true }),
  ConsignmentInquiry: reactModule(ConsignmentInquiryScreen, {
    hidesBottomTabs: true,
    screenOptions: {
      gestureEnabled: false,
    },
  }),
  Conversation: reactModule(Conversation, { onlyShowInTabName: "inbox" }),
  ConversationDetails: reactModule(ConversationDetailsQueryRenderer),
  DarkModeSettings: reactModule(DarkModeSettings),
  DevMenu: reactModule(DevMenu, { hidesBottomTabs: true, hidesBackButton: true }),
  EditSavedSearchAlert: reactModule(EditSavedSearchAlertQueryRenderer, {
    hidesBackButton: true,
    hidesBottomTabs: true,
  }),
  Fair: reactModule(FairQueryRenderer, { fullBleed: true, hidesBackButton: true }),
  FairMoreInfo: reactModule(FairMoreInfoQueryRenderer),
  FairArticles: reactModule(FairArticlesQueryRenderer),
  FairAllFollowedArtists: reactModule(FairAllFollowedArtistsQueryRenderer),
  Favorites: reactModule(Favorites, {
    fullBleed: true,
    hidesBackButton: true,
  }),
  Feature: reactModule(FeatureQueryRenderer, { fullBleed: true }),
  FullArtistSeriesList: reactModule(ArtistSeriesFullArtistSeriesListQueryRenderer),
  FullFeaturedArtistList: reactModule(CollectionFullFeaturedArtistListQueryRenderer),
  GalleriesForYou: reactModule(GalleriesForYouScreen, {
    fullBleed: true,
    hidesBackButton: true,
  }),
  Gene: reactModule(GeneQueryRenderer, {
    fullBleed: true,
    hidesBackButton: true,
  }),
  Home: reactModule(HomeContainer, {
    isRootViewForTabName: "home",
  }),
  Inbox: reactModule(InboxQueryRenderer, { isRootViewForTabName: "inbox" }, [InboxScreenQuery]),
  Inquiry: reactModule(Inquiry, { alwaysPresentModally: true, hasOwnModalCloseButton: true }),
  LiveAuction: reactModule(LiveAuctionView, {
    alwaysPresentModally: true,
    hasOwnModalCloseButton: true,
    modalPresentationStyle: "fullScreen",
  }),
  LocalDiscovery: reactModule(CityGuideView, { fullBleed: true }),
  MakeOfferModal: reactModule(MakeOfferModalQueryRenderer, {
    hasOwnModalCloseButton: true,
  }),
  MedianSalePriceAtAuction: reactModule(MedianSalePriceAtAuction),
  Map: reactModule(MapContainer, { fullBleed: true, ignoreTabs: true }),
  MyAccount: reactModule(MyAccountQueryRenderer),
  MyAccountEditEmail: reactModule(MyAccountEditEmailQueryRenderer, { hidesBackButton: true }),
  MyAccountEditPriceRange: reactModule(MyAccountEditPriceRangeQueryRenderer, {
    hidesBackButton: true,
  }),
  MyAccountEditPassword: reactModule(MyAccountEditPassword, { hidesBackButton: true }),
  MyAccountEditPhone: reactModule(MyAccountEditPhoneQueryRenderer, { hidesBackButton: true }),
  MyAccountDeleteAccount: reactModule(MyAccountDeleteAccountQueryRenderer),
  MyBids: reactModule(MyBidsQueryRenderer),
  MyCollection: reactModule(MyCollectionQueryRenderer),
  MyCollectionArtwork: reactModule(
    MyCollectionArtworkScreen,
    { fullBleed: true, hidesBackButton: true },
    [MyCollectionArtworkScreenQuery]
  ),
  MyCollectionArtworkAdd: reactModule(MyCollectionArtworkAdd, {
    hidesBackButton: true,
    hidesBottomTabs: true,
    alwaysPresentModally: true,
    modalPresentationStyle: "fullScreen",
  }),
  MyCollectionArtworkEdit: reactModule(MyCollectionArtworkEditQueryRenderer, {
    hidesBackButton: true,
    hidesBottomTabs: true,
    alwaysPresentModally: true,
    modalPresentationStyle: "fullScreen",
  }),
  MyCollectionAddCollectedArtists: reactModule(MyCollectionAddCollectedArtistsScreen, {
    screenOptions: {
      gestureEnabled: false,
    },
    hidesBottomTabs: true,
  }),
  MyCollectionSellingWithartsyFAQ: reactModule(MyCollectionSellingWithArtsyFAQ),
  MyCollectionCollectedArtistsPrivacy: reactModule(
    MyCollectionCollectedArtistsPrivacyQueryRenderer,
    {
      hidesBackButton: true,
      hidesBottomTabs: true,
      screenOptions: {
        gestureEnabled: false,
      },
    }
  ),

  MyProfile: reactModule(
    MyProfile,
    {
      isRootViewForTabName: "profile",
      fullBleed: true,
    },
    [MyCollectionScreenQuery]
  ),
  MyProfileEditForm: reactModule(MyProfileEditFormScreen),
  MyProfilePayment: reactModule(MyProfilePaymentQueryRenderer),
  MyProfileSettings: reactModule(MyProfileSettings),
  MySellingProfile: reactModule(View),
  NewWorksForYou: reactModule(NewWorksForYouQueryRenderer, {
    hidesBottomTabs: true,
    hidesBackButton: true,
    fullBleed: true,
  }),
  MyProfilePaymentNewCreditCard: reactModule(MyProfilePaymentNewCreditCard, {
    hidesBackButton: true,
  }),
  MyProfilePushNotifications: reactModule(MyProfilePushNotificationsQueryRenderer),
  NewWorksFromGalleriesYouFollow: reactModule(NewWorksFromGalleriesYouFollowScreen, {
    hidesBackButton: true,
    fullBleed: true,
  }),
  News: reactModule(
    NewsScreen,
    {
      fullBleed: true,
      hidesBackButton: true,
    },
    [NewsScreenQuery]
  ),
  OrderHistory: reactModule(OrderHistoryQueryRender),
  OrderDetails: reactModule(OrderDetailsQueryRender),
  Partner: reactModule(PartnerQueryRenderer, {
    fullBleed: true,
    hidesBackButton: true,
  }),
  PartnerLocations: reactModule(PartnerLocations),
  PartnerOfferContainer: reactModule(PartnerOfferContainer, {
    hidesBottomTabs: true,
    hidesBackButton: true,
  }),
  PriceDatabase: reactModule(PriceDatabase, { hidesBackButton: true }),
  PrivacyRequest: reactModule(PrivacyRequest),
  PurchaseModal: reactModule(PurchaseModalQueryRenderer, {
    hasOwnModalCloseButton: true,
  }),
  ModalWebView: reactModule(ArtsyWebViewPage, {
    fullBleed: false,
    hasOwnModalCloseButton: true,
    hidesBackButton: true,
    alwaysPresentModally: true,
    modalPresentationStyle: "fullScreen",
    screenOptions: {
      gestureEnabled: false,
    },
  }),
  ReactWebView: reactModule(ArtsyWebViewPage, {
    fullBleed: true,
    hasOwnModalCloseButton: true,
    hidesBackButton: true,
  }),
  RequestForPriceEstimateScreen: reactModule(RequestForPriceEstimateScreen),
  RequestForPriceEstimateConfirmationScreen: reactModule(
    RequestForPriceEstimateConfirmationScreen,
    { hidesBackButton: true }
  ),
  RecentlyViewed: reactModule(
    RecentlyViewedScreen,
    {
      hidesBackButton: true,
      fullBleed: true,
    },
    [RecentlyViewedScreenQuery]
  ),
  RecommendedAuctionLots: reactModule(RecommendedAuctionLotsQueryRenderer, {
    hidesBottomTabs: true,
    hidesBackButton: true,
    fullBleed: true,
  }),
  Sell: reactModule(SellWithArtsy, { isRootViewForTabName: "sell", fullBleed: true }, [
    SellWithArtsyHomeScreenQuery,
  ]),
  SellNotRootTabView: reactModule(SellWithArtsy),
  SavedArtworks: reactModule(SavedArtworks, {
    fullBleed: true,
    hidesBackButton: true,
  }),
  SavedSearchAlertsList: reactModule(SavedSearchAlertsListQueryRenderer, {
    fullBleed: true,
    hidesBackButton: true,
  }),
  Search: reactModule(SearchScreen, { isRootViewForTabName: "search" }, [SearchScreenQuery]),
  Show: reactModule(ShowQueryRenderer, { fullBleed: true }),
  ShowMoreInfo: reactModule(ShowMoreInfoQueryRenderer),
  SimilarToRecentlyViewed: reactModule(SimilarToRecentlyViewedScreen, {
    hidesBackButton: true,
    fullBleed: true,
  }),
  SubmitArtwork: unsafe_getFeatureFlag("AREnableNewSubmissionFlow")
    ? reactModule(SubmitArtworkForm, {
        hidesBackButton: true,
        alwaysPresentModally: true,
        modalPresentationStyle: "fullScreen",
        hidesBottomTabs: true,
        screenOptions: {
          gestureEnabled: false,
        },
      })
    : reactModule(SubmitArtwork, { hidesBackButton: true, hidesBottomTabs: true }),
  SubmitArtworkEdit: reactModule(SubmitArtworkFormEdit, {
    hidesBackButton: true,
    alwaysPresentModally: true,
    modalPresentationStyle: "fullScreen",
    hidesBottomTabs: true,
    screenOptions: {
      gestureEnabled: false,
    },
  }),
  Tag: reactModule(TagQueryRenderer, { hidesBackButton: true, fullBleed: true }),
  UnlistedArtworksFAQScreen: reactModule(UnlistedArtworksFAQScreen),
  VanityURLEntity: reactModule(VanityURLEntityRenderer, { fullBleed: true }),
  ViewingRoom: reactModule(ViewingRoomQueryRenderer, { fullBleed: true }),
  ViewingRoomArtwork: reactModule(ViewingRoomArtworkScreen),
  ViewingRoomArtworks: reactModule(ViewingRoomArtworksQueryRenderer),
  ViewingRooms: reactModule(ViewingRoomsListScreen, {}, [viewingRoomsListScreenQuery]),
  WorksForYou: reactModule(WorksForYouQueryRenderer, {}, [WorksForYouScreenQuery]),
})

// Register react modules with the app registry
for (const moduleName of Object.keys(modules)) {
  const descriptor = modules[moduleName as AppModule]
  if (Platform.OS === "ios") {
    // TODO: this should not be needed. right?
    register(moduleName, descriptor.Component, {
      fullBleed: descriptor.options.fullBleed,
      ignoreTabs: descriptor.options.ignoreTabs,
      moduleName,
    })
  }
}
