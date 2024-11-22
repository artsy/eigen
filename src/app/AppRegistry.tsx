import { Flex } from "@artsy/palette-mobile"
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
import { CollectionScreen } from "app/Scenes/Collection/Collection"
import { CollectionsByCategory } from "app/Scenes/CollectionsByCategory/CollectionsByCategory"
import { CompleteMyProfile } from "app/Scenes/CompleteMyProfile/CompleteMyProfile"
import { GalleriesForYouScreen } from "app/Scenes/GalleriesForYou/GalleriesForYouScreen"
import { HomeContainer } from "app/Scenes/Home/HomeContainer"
import { HomeViewScreen, homeViewScreenQuery } from "app/Scenes/HomeView/HomeView"
import { HomeViewSectionScreenQueryRenderer } from "app/Scenes/HomeViewSectionScreen/HomeViewSectionScreen"
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
import { SubmitArtworkFormEditContainer } from "app/Scenes/SellWithArtsy/ArtworkForm/SubmitArtworkFormEdit"
import { SimilarToRecentlyViewedScreen } from "app/Scenes/SimilarToRecentlyViewed/SimilarToRecentlyViewed"
import { BackButton } from "app/system/navigation/BackButton"
import { goBack } from "app/system/navigation/navigate"
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
import { CollectionFullFeaturedArtistListQueryRenderer } from "./Scenes/Collection/Components/FullFeaturedArtistList"
import { FairScreen, FairScreenQuery } from "./Scenes/Fair/Fair"
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
import { SellWithArtsy } from "./Scenes/SellWithArtsy/SubmitArtwork/UploadPhotos/utils"
import { ShowMoreInfoQueryRenderer } from "./Scenes/Show/Screens/ShowMoreInfo"
import { ShowQueryRenderer } from "./Scenes/Show/Show"
import { TagQueryRenderer } from "./Scenes/Tag/Tag"
import { VanityURLEntityRenderer } from "./Scenes/VanityURL/VanityURLEntity"
import { ViewingRoomQueryRenderer, ViewingRoomScreenQuery } from "./Scenes/ViewingRoom/ViewingRoom"
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

export type ModuleDescriptor = {
  type: "react"
  Component: React.ComponentType<any>
  Queries?: GraphQLTaggedNode[]
  options: ViewOptions
}

function reactModule({
  Component,
  options = {},
  Queries,
}: {
  Component: React.ComponentType<any>
  options?: ViewOptions
  Queries?: GraphQLTaggedNode[]
}): ModuleDescriptor {
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
  Activity: reactModule({
    Component: ActivityScreen,
    options: {
      fullBleed: true,
      hidesBackButton: true,
      hidesBottomTabs: true,
    },
  }),
  ActivityItem: reactModule({
    Component: ActivityItemScreenQueryRenderer,
    options: {
      fullBleed: true,
      hidesBackButton: true,
      hidesBottomTabs: true,
    },
  }),
  About: reactModule({
    Component: About,
    options: {
      screenOptions: {
        headerTitle: "About",
      },
    },
  }),
  AddMyCollectionArtist: reactModule({
    Component: AddMyCollectionArtist,
    options: {
      hidesBackButton: true,
    },
  }),
  AlertArtworks: reactModule({
    Component: AlertArtworks,
    options: {
      fullBleed: true,
      hidesBackButton: true,
      hidesBottomTabs: true,
    },
  }),
  ArtQuiz: reactModule({
    Component: ArtQuiz,
    options: { ...artQuizScreenOptions, hidesBottomTabs: true },
  }),
  ArtQuizResults: reactModule({
    Component: ArtQuizResults,
    options: {
      fullBleed: true,
      hidesBackButton: true,
      screenOptions: {
        animationTypeForReplace: "pop",
      },
    },
  }),
  Article: reactModule({
    Component: ArticleScreen,
    options: {
      fullBleed: true,
      hidesBackButton: true,
    },
  }),
  ArticleSlideShow: reactModule({
    Component: ArticlesSlideShowScreen,
    options: {
      fullBleed: true,
      hidesBackButton: true,
      hidesBottomTabs: true,
    },
  }),
  Articles: reactModule({
    Component: ArticlesScreen,
    options: {
      fullBleed: true,
      hidesBackButton: true,
    },
    Queries: [ArticlesScreenQuery],
  }),
  Artist: reactModule({
    Component: ArtistQueryRenderer,

    options: { fullBleed: true, hidesBackButton: true },
    Queries: [ArtistScreenQuery],
  }),
  ArtistShows: reactModule({ Component: ArtistShows2QueryRenderer }),
  ArtistArticles: reactModule({
    Component: ArtistArticlesQueryRenderer,
    options: { fullBleed: true, hidesBackButton: true },
  }),
  ArtistSeries: reactModule({
    Component: ArtistSeriesQueryRenderer,
    options: { fullBleed: true, hidesBackButton: true },
  }),
  Artwork: reactModule({
    Component: ArtworkScreen,
    options: { hidesBackButton: true, hidesBottomTabs: true },
    Queries: [ArtworkScreenQuery],
  }),
  ArtworkMedium: reactModule({
    Component: ArtworkMediumQueryRenderer,
    options: {
      fullBleed: true,
      alwaysPresentModally: !unsafe_getFeatureFlag("AREnableNewNavigation"),
      modalPresentationStyle: !unsafe_getFeatureFlag("AREnableNewNavigation")
        ? "fullScreen"
        : undefined,
    },
  }),
  ArtworkAttributionClassFAQ: reactModule({
    Component: ArtworkAttributionClassFAQQueryRenderer,
    options: {
      fullBleed: true,
      alwaysPresentModally: !unsafe_getFeatureFlag("AREnableNewNavigation"),
      modalPresentationStyle: !unsafe_getFeatureFlag("AREnableNewNavigation")
        ? "fullScreen"
        : undefined,
    },
  }),
  ArtworkCertificateAuthenticity: reactModule({
    Component: CertificateOfAuthenticity,
    options: {
      fullBleed: true,
      alwaysPresentModally: !unsafe_getFeatureFlag("AREnableNewNavigation"),
      modalPresentationStyle: !unsafe_getFeatureFlag("AREnableNewNavigation")
        ? "fullScreen"
        : undefined,
    },
  }),
  ArtworkList: reactModule({ Component: ArtworkListScreen, options: { hidesBackButton: true } }),
  ArtworkRecommendations: reactModule({ Component: ArtworkRecommendationsScreen }),
  Auction: reactModule({
    Component: SaleQueryRenderer,
    options: { fullBleed: true },
    Queries: [SaleScreenQuery],
  }),
  Auctions: reactModule({
    Component: SalesScreen,
    options: {
      hidesBackButton: true,
      fullBleed: true,
    },
    Queries: [SalesScreenQuery],
  }),
  AuctionInfo: reactModule({ Component: SaleInfoQueryRenderer }),
  AuctionResult: reactModule({
    Component: AuctionResultQueryRenderer,
    options: {
      hidesBackButton: !unsafe_getFeatureFlag("AREnableNewNavigation"),
    },
  }),
  AuctionResultsForArtistsYouFollow: reactModule({
    Component: AuctionResultsForArtistsYouFollowQueryRenderer,
    Queries: [AuctionResultsForArtistsYouFollowPrefetchQuery],
  }),
  AuctionResultsForArtistsYouCollect: reactModule({
    Component: AuctionResultsForArtistsYouCollect,
  }),
  AuctionRegistration: reactModule({
    Component: RegistrationFlow,
    options: {
      alwaysPresentModally: true,
      fullBleed: Platform.OS === "ios" && !unsafe_getFeatureFlag("AREnableNewNavigation"),
      hasOwnModalCloseButton: true,
      screenOptions: {
        // Don't allow the screen to be swiped away by mistake
        gestureEnabled: false,
      },
    },
  }),
  AuctionBidArtwork: reactModule({
    Component: BidFlow,
    options: {
      alwaysPresentModally: true,
      hasOwnModalCloseButton: true,
      fullBleed: !unsafe_getFeatureFlag("AREnableNewNavigation"),
    },
  }),
  AuctionBuyersPremium: reactModule({
    Component: AuctionBuyersPremiumQueryRenderer,
    options: {
      fullBleed: true,
      alwaysPresentModally: !unsafe_getFeatureFlag("AREnableNewNavigation"),
      modalPresentationStyle: !unsafe_getFeatureFlag("AREnableNewNavigation")
        ? "fullScreen"
        : undefined,
    },
  }),
  BottomTabs: reactModule({ Component: BottomTabs, options: { fullBleed: true } }),
  BrowseSimilarWorks: reactModule({
    Component: BrowseSimilarWorksQueryRenderer,
    options: {
      hidesBackButton: true,
      hidesBottomTabs: true,
    },
  }),
  CareerHighlightsBigCardsSwiper: reactModule({
    Component: CareerHighlightsBigCardsSwiper,
    options: {
      alwaysPresentModally: !unsafe_getFeatureFlag("AREnableNewNavigation"),
      fullBleed: !unsafe_getFeatureFlag("AREnableNewNavigation"),
      hidesBackButton: true,
      hidesBottomTabs: unsafe_getFeatureFlag("AREnableNewNavigation"),
    },
  }),
  City: reactModule({ Component: CityView, options: { fullBleed: true, ignoreTabs: true } }),
  CityFairList: reactModule({ Component: CityFairListQueryRenderer, options: { fullBleed: true } }),
  CityPicker: reactModule({
    Component: CityPicker,
    options: { fullBleed: true, ignoreTabs: true },
  }),
  CitySavedList: reactModule({ Component: CitySavedListQueryRenderer }),
  CitySectionList: reactModule({ Component: CitySectionListQueryRenderer }),
  Collection: reactModule({
    Component: CollectionScreen,
    options: { fullBleed: true, hidesBackButton: true },
  }),
  CollectionsByCategory: reactModule({
    Component: CollectionsByCategory,
    options: {
      fullBleed: true,
      hidesBackButton: true,
    },
  }),
  ConsignmentInquiry: reactModule({
    Component: ConsignmentInquiryScreen,
    options: {
      hidesBottomTabs: !unsafe_getFeatureFlag("AREnableNewNavigation"),
      screenOptions: {
        gestureEnabled: false,
      },
    },
  }),
  Conversation: reactModule({
    Component: Conversation,
    options: {
      onlyShowInTabName: "inbox",
      hidesBackButton: true,
    },
  }),
  ConversationDetails: reactModule({
    Component: ConversationDetailsQueryRenderer,
    options: {
      screenOptions: {
        headerTitle: "Details",
      },
    },
  }),
  DarkModeSettings: reactModule({ Component: DarkModeSettings }),
  DevMenu: reactModule({
    Component: DevMenu,
    options: {
      // No need to hide bottom tabs if it's a modal because they will be hidden by default
      hidesBottomTabs: !unsafe_getFeatureFlag("AREnableNewNavigation"),
      hidesBackButton: !unsafe_getFeatureFlag("AREnableNewNavigation"),
      alwaysPresentModally: !!unsafe_getFeatureFlag("AREnableNewNavigation"),
      fullBleed: !!unsafe_getFeatureFlag("AREnableNewNavigation"),
      screenOptions: {
        headerTitle: "Dev Settings",
        headerLargeTitle: true,
        headerLeft: () => {
          return <Flex />
        },
      },
    },
  }),
  EditSavedSearchAlert: reactModule({
    Component: EditSavedSearchAlertQueryRenderer,
    options: {
      hidesBackButton: true,
      hidesBottomTabs: true,
    },
  }),
  Fair: reactModule({
    Component: FairScreen,
    options: { fullBleed: true, hidesBackButton: true },
    Queries: [FairScreenQuery],
  }),
  FairMoreInfo: reactModule({
    Component: FairMoreInfoQueryRenderer,
    options: { fullBleed: true, hidesBackButton: true },
  }),
  FairArticles: reactModule({ Component: FairArticlesQueryRenderer }),
  FairAllFollowedArtists: reactModule({ Component: FairAllFollowedArtistsQueryRenderer }),
  Favorites: reactModule({
    Component: Favorites,
    options: {
      fullBleed: true,
      hidesBackButton: true,
    },
  }),
  Feature: reactModule({ Component: FeatureQueryRenderer, options: { fullBleed: true } }),
  FullArtistSeriesList: reactModule({ Component: ArtistSeriesFullArtistSeriesListQueryRenderer }),
  FullFeaturedArtistList: reactModule({
    Component: CollectionFullFeaturedArtistListQueryRenderer,
    options: {
      screenOptions: {
        headerTitle: "Featured Artists",
      },
    },
  }),
  GalleriesForYou: reactModule({
    Component: GalleriesForYouScreen,
    options: {
      fullBleed: true,
      hidesBackButton: true,
    },
  }),
  Gene: reactModule({
    Component: GeneQueryRenderer,
    options: {
      fullBleed: true,
      hidesBackButton: true,
    },
  }),
  Home: reactModule({
    Component: HomeContainer,
    options: {
      isRootViewForTabName: "home",
      hidesBackButton: true,
      fullBleed: true,
    },
    Queries: [homeViewScreenQuery],
  }),
  HomeView: reactModule({ Component: HomeViewScreen, options: { hidesBackButton: true } }),
  HomeViewSectionScreen: reactModule({
    Component: HomeViewSectionScreenQueryRenderer,
    options: {
      hidesBackButton: true,
      fullBleed: true,
    },
  }),
  Inbox: reactModule({
    Component: InboxQueryRenderer,
    options: {
      isRootViewForTabName: "inbox",
      hidesBackButton: true,
      fullBleed: true,
    },
    Queries: [InboxScreenQuery],
  }),
  Inquiry: reactModule({
    Component: Inquiry,
    options: { alwaysPresentModally: true, hasOwnModalCloseButton: true },
  }),
  LiveAuction: reactModule({
    Component: LiveAuctionView,
    options: {
      alwaysPresentModally: true,
      hasOwnModalCloseButton: true,
      modalPresentationStyle: "fullScreen",
    },
  }),
  LocalDiscovery: reactModule({
    Component: CityGuideView,
    options: {
      fullBleed: true,
      screenOptions: unsafe_getFeatureFlag("AREnableNewNavigation")
        ? {
            headerTransparent: true,
            headerLeft: () => {
              return (
                <BackButton
                  style={{
                    top: 0,
                    left: 0,
                  }}
                  onPress={() => {
                    goBack()
                  }}
                />
              )
            },
          }
        : undefined,
    },
  }),
  MakeOfferModal: reactModule({
    Component: MakeOfferModalQueryRenderer,
    options: {
      hasOwnModalCloseButton: true,
    },
  }),
  MedianSalePriceAtAuction: reactModule({ Component: MedianSalePriceAtAuction }),
  Map: reactModule({ Component: MapContainer, options: { fullBleed: true, ignoreTabs: true } }),
  MyAccount: reactModule({
    Component: MyAccountQueryRenderer,
    options: {
      screenOptions: {
        headerTitle: "Account Settings",
      },
    },
  }),
  MyAccountEditEmail: reactModule({
    Component: MyAccountEditEmailQueryRenderer,
    options: {
      hidesBackButton: !unsafe_getFeatureFlag("AREnableNewNavigation"),
      screenOptions: {
        headerTitle: "Email",
      },
    },
  }),
  MyAccountEditPriceRange: reactModule({
    Component: MyAccountEditPriceRangeQueryRenderer,
    options: {
      hidesBackButton: !unsafe_getFeatureFlag("AREnableNewNavigation"),
      screenOptions: {
        headerTitle: "Price Range",
      },
    },
  }),
  MyAccountEditPassword: reactModule({
    Component: MyAccountEditPassword,
    options: {
      hidesBackButton: !unsafe_getFeatureFlag("AREnableNewNavigation"),
      screenOptions: {
        headerTitle: "Password",
      },
    },
  }),
  MyAccountEditPhone: reactModule({
    Component: MyAccountEditPhoneQueryRenderer,
    options: {
      hidesBackButton: !unsafe_getFeatureFlag("AREnableNewNavigation"),
      screenOptions: {
        headerTitle: "Phone Number",
      },
    },
  }),
  MyAccountDeleteAccount: reactModule({ Component: MyAccountDeleteAccountQueryRenderer }),
  MyBids: reactModule({ Component: MyBidsQueryRenderer }),
  MyCollection: reactModule({ Component: MyCollectionQueryRenderer }),
  MyCollectionArtwork: reactModule({
    Component: MyCollectionArtworkScreen,
    options: { fullBleed: true, hidesBackButton: true },
    Queries: [MyCollectionArtworkScreenQuery],
  }),
  MyCollectionArtworkAdd: reactModule({
    Component: MyCollectionArtworkAdd,
    options: {
      hidesBackButton: true,
      hidesBottomTabs: !unsafe_getFeatureFlag("AREnableNewNavigation"),
      alwaysPresentModally: true,
      modalPresentationStyle: "fullScreen",
      screenOptions: {
        gestureEnabled: false,
      },
    },
  }),
  MyCollectionArtworkEdit: reactModule({
    Component: MyCollectionArtworkEditQueryRenderer,
    options: {
      hidesBackButton: true,
      hidesBottomTabs: !unsafe_getFeatureFlag("AREnableNewNavigation"),
      alwaysPresentModally: true,
      modalPresentationStyle: "fullScreen",
      screenOptions: {
        gestureEnabled: false,
      },
    },
  }),
  MyCollectionAddCollectedArtists: reactModule({
    Component: MyCollectionAddCollectedArtistsScreen,
    options: {
      hidesBackButton: !unsafe_getFeatureFlag("AREnableNewNavigation"),
      hidesBottomTabs: true,
      screenOptions: {
        headerTitle: "Add Artists You Collect",
        gestureEnabled: false,
      },
    },
  }),
  MyCollectionSellingWithartsyFAQ: reactModule({ Component: MyCollectionSellingWithArtsyFAQ }),
  MyCollectionCollectedArtistsPrivacy: reactModule({
    Component: MyCollectionCollectedArtistsPrivacyQueryRenderer,
    options: {
      hidesBackButton: true,
      hidesBottomTabs: true,
      screenOptions: {
        gestureEnabled: false,
      },
    },
  }),

  MyProfile: reactModule({
    Component: MyProfile,
    options: {
      isRootViewForTabName: "profile",
      fullBleed: true,
      hidesBackButton: true,
    },
    Queries: [MyCollectionScreenQuery],
  }),
  CompleteMyProfile: reactModule({
    Component: CompleteMyProfile,
    options: {
      fullBleed: true,
      hidesBackButton: true,
      hidesBottomTabs: true,
    },
  }),
  MyProfileEditForm: reactModule({
    Component: MyProfileEditFormScreen,
    options: {
      screenOptions: {
        headerTitle: "Edit Profile",
      },
    },
  }),
  MyProfilePayment: reactModule({
    Component: MyProfilePaymentQueryRenderer,
    options: {
      screenOptions: {
        headerTitle: "Payment",
      },
    },
  }),
  MyProfileSettings: reactModule({
    Component: MyProfileSettings,
    options: {
      screenOptions: {
        headerTitle: "Account",
      },
    },
  }),
  MySellingProfile: reactModule({ Component: View }),
  NewWorksForYou: reactModule({
    Component: NewWorksForYouQueryRenderer,
    options: {
      hidesBottomTabs: true,
      hidesBackButton: true,
      fullBleed: true,
    },
  }),
  MyProfilePaymentNewCreditCard: reactModule({
    Component: MyProfilePaymentNewCreditCard,
    options: {
      screenOptions: {
        headerTitle: "Add new card",
      },
    },
  }),
  MyProfilePushNotifications: reactModule({
    Component: MyProfilePushNotificationsQueryRenderer,
    options: {
      screenOptions: {
        headerTitle: "Push Notifications",
      },
    },
  }),
  NewWorksFromGalleriesYouFollow: reactModule({
    Component: NewWorksFromGalleriesYouFollowScreen,
    options: {
      hidesBackButton: true,
      fullBleed: true,
    },
  }),
  News: reactModule({
    Component: NewsScreen,
    options: {
      fullBleed: true,
      hidesBackButton: true,
    },
    Queries: [NewsScreenQuery],
  }),
  OrderHistory: reactModule({
    Component: OrderHistoryQueryRender,
    options: {
      screenOptions: {
        headerTitle: "Order History",
      },
    },
  }),
  OrderDetails: reactModule({
    Component: OrderDetailsQueryRender,
    options: {
      screenOptions: {
        headerTitle: "Order Details",
      },
    },
  }),
  Partner: reactModule({
    Component: PartnerQueryRenderer,
    options: {
      fullBleed: true,
      hidesBackButton: true,
    },
  }),
  PartnerLocations: reactModule({ Component: PartnerLocations }),
  PartnerOfferContainer: reactModule({
    Component: PartnerOfferContainer,
    options: {
      hidesBottomTabs: true,
      hidesBackButton: true,
    },
  }),
  PriceDatabase: reactModule({ Component: PriceDatabase, options: { hidesBackButton: true } }),
  PrivacyRequest: reactModule({
    Component: PrivacyRequest,
    options: {
      screenOptions: {
        headerTitle: "Personal Data Request",
      },
    },
  }),
  PurchaseModal: reactModule({
    Component: PurchaseModalQueryRenderer,
    options: {
      hasOwnModalCloseButton: true,
    },
  }),
  ModalWebView: reactModule({
    Component: ArtsyWebViewPage,
    options: {
      hasOwnModalCloseButton: true,
      hidesBackButton: true,
      alwaysPresentModally: true,
      modalPresentationStyle: !unsafe_getFeatureFlag("AREnableNewNavigation")
        ? "fullScreen"
        : undefined,
      screenOptions: {
        gestureEnabled: false,
      },
    },
  }),
  ReactWebView: reactModule({
    Component: ArtsyWebViewPage,
    options: {
      fullBleed: !unsafe_getFeatureFlag("AREnableNewNavigation"),
      hasOwnModalCloseButton: true,
      hidesBackButton: true,
    },
  }),
  RequestForPriceEstimateScreen: reactModule({ Component: RequestForPriceEstimateScreen }),
  RequestForPriceEstimateConfirmationScreen: reactModule({
    Component: RequestForPriceEstimateConfirmationScreen,
    options: { hidesBackButton: true },
  }),
  RecentlyViewed: reactModule({
    Component: RecentlyViewedScreen,
    options: {
      hidesBackButton: true,
      fullBleed: true,
    },
    Queries: [RecentlyViewedScreenQuery],
  }),
  RecommendedAuctionLots: reactModule({
    Component: RecommendedAuctionLotsQueryRenderer,
    options: {
      hidesBottomTabs: true,
      hidesBackButton: true,
      fullBleed: true,
    },
  }),
  Sell: reactModule({
    Component: SellWithArtsy,
    options: { isRootViewForTabName: "sell", fullBleed: true, hidesBackButton: true },
    Queries: [SellWithArtsyHomeScreenQuery],
  }),
  SellNotRootTabView: reactModule({ Component: SellWithArtsy }),
  SavedArtworks: reactModule({
    Component: SavedArtworks,
    options: {
      fullBleed: true,
      hidesBackButton: true,
    },
  }),
  SavedSearchAlertsList: reactModule({
    Component: SavedSearchAlertsListQueryRenderer,
    options: {
      fullBleed: true,
      hidesBackButton: true,
    },
  }),
  Search: reactModule({
    Component: SearchScreen,
    options: { isRootViewForTabName: "search", hidesBackButton: true, fullBleed: true },
    Queries: [SearchScreenQuery],
  }),
  Show: reactModule({ Component: ShowQueryRenderer, options: { fullBleed: true } }),
  ShowMoreInfo: reactModule({ Component: ShowMoreInfoQueryRenderer }),
  SimilarToRecentlyViewed: reactModule({
    Component: SimilarToRecentlyViewedScreen,
    options: {
      hidesBackButton: true,
      fullBleed: true,
    },
  }),
  SubmitArtwork: reactModule({
    Component: SubmitArtworkForm,
    options: {
      hidesBackButton: true,
      alwaysPresentModally: true,
      modalPresentationStyle: !unsafe_getFeatureFlag("AREnableNewNavigation")
        ? "fullScreen"
        : undefined,
      screenOptions: {
        gestureEnabled: false,
      },
    },
  }),
  SubmitArtworkEdit: reactModule({
    Component: SubmitArtworkFormEditContainer,
    options: {
      hidesBackButton: true,
      alwaysPresentModally: true,
      hidesBottomTabs: true,
      screenOptions: {
        gestureEnabled: false,
      },
    },
  }),
  Tag: reactModule({
    Component: TagQueryRenderer,
    options: { hidesBackButton: true, fullBleed: true },
  }),
  UnlistedArtworksFAQScreen: reactModule({ Component: UnlistedArtworksFAQScreen }),
  VanityURLEntity: reactModule({
    Component: VanityURLEntityRenderer,
    options: { fullBleed: true },
  }),
  ViewingRoom: reactModule({
    Component: ViewingRoomQueryRenderer,
    options: { fullBleed: true },
    Queries: [ViewingRoomScreenQuery],
  }),
  ViewingRoomArtwork: reactModule({ Component: ViewingRoomArtworkScreen }),
  ViewingRoomArtworks: reactModule({ Component: ViewingRoomArtworksQueryRenderer }),
  ViewingRooms: reactModule({
    Component: ViewingRoomsListScreen,
    Queries: [viewingRoomsListScreenQuery],
  }),
  WorksForYou: reactModule({
    Component: WorksForYouQueryRenderer,
    Queries: [WorksForYouScreenQuery],
  }),
})

for (const moduleName of Object.keys(modules)) {
  const descriptor = modules[moduleName as AppModule]
  if (Platform.OS === "ios" && !unsafe_getFeatureFlag("AREnableNewNavigation")) {
    // TODO: this should not be needed. right?
    register(moduleName, descriptor.Component, {
      fullBleed: descriptor.options.fullBleed,
      ignoreTabs: descriptor.options.ignoreTabs,
      moduleName,
    })
  }
}
