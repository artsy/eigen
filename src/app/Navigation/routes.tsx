import { BackButton, Flex } from "@artsy/palette-mobile"
import { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { artistArtworksQuery } from "app/Components/Artist/ArtistArtworks/ArtistArtworks"
import { ArtsyWebViewConfig, ArtsyWebViewPage } from "app/Components/ArtsyWebView"
import { BidFlow } from "app/Components/Containers/BidFlow"
import { InboxScreen, InboxScreenQuery } from "app/Components/Containers/Inbox"
import { InquiryQueryRenderer } from "app/Components/Containers/Inquiry"
import { RegistrationFlow } from "app/Components/Containers/RegistrationFlow"
import {
  WorksForYouQueryRenderer,
  WorksForYouScreenQuery,
} from "app/Components/Containers/WorksForYou"
import { BACK_BUTTON_SIZE_SIZE } from "app/Components/constants"
import { LiveAuctionView } from "app/NativeModules/LiveAuctionView"
import { About } from "app/Scenes/About/About"
import { activityContentQuery } from "app/Scenes/Activity/ActivityContent"
import {
  ActivityItemQuery,
  ActivityItemScreenQueryRenderer,
} from "app/Scenes/Activity/ActivityItemScreen"
import { ActivityScreen } from "app/Scenes/Activity/ActivityScreen"
import { activityHeaderQuery } from "app/Scenes/Activity/components/ActivityHeader"
import { ArtQuiz, ArtQuizScreenQuery } from "app/Scenes/ArtQuiz/ArtQuiz"
import {
  ArtQuizResults,
  ArtQuizResultsScreenQuery,
} from "app/Scenes/ArtQuiz/ArtQuizResults/ArtQuizResults"
import { ArticleScreen, articleScreenQuery } from "app/Scenes/Article/ArticleScreen"
import { ArticlesSlideShowScreen } from "app/Scenes/ArticleSlideShow/ArticleSlideShow"
import { ArticlesScreen, ArticlesScreenQuery } from "app/Scenes/Articles/Articles"
import { NewsScreen, NewsScreenQuery } from "app/Scenes/Articles/News/News"
import {
  ArtistQueryRenderer,
  ArtistScreenQuery,
  defaultArtistVariables,
} from "app/Scenes/Artist/Artist"
import {
  ArtistArticlesQueryRenderer,
  ArtistArticlesResultScreenQuery,
} from "app/Scenes/ArtistArticles/ArtistArticles"
import {
  ArtistSeriesQueryRenderer,
  ArtistSeriesScreenQuery,
} from "app/Scenes/ArtistSeries/ArtistSeries"
import {
  ArtistSeriesFullArtistSeriesListQueryRenderer,
  ArtistSeriesFullArtistSeriesScreenQuery,
} from "app/Scenes/ArtistSeries/ArtistSeriesFullArtistSeriesList"
import {
  ArtistShowsQueryRenderer,
  ArtistShowsScreenQuery,
} from "app/Scenes/ArtistShows/ArtistShows"
import { ArtworkScreen, ArtworkScreenQuery } from "app/Scenes/Artwork/Artwork"
import {
  BrowseSimilarWorksQueryRenderer,
  BrowseSimilarWorksScreenQuery,
} from "app/Scenes/Artwork/Components/BrowseSimilarWorks/BrowseSimilarWorks"
import { CertificateOfAuthenticity } from "app/Scenes/Artwork/Components/CertificateAuthenticity"
import { UnlistedArtworksFAQScreen } from "app/Scenes/Artwork/Components/UnlistedArtworksFAQScreen"
import {
  ArtworkAttributionClassFAQQueryRenderer,
  ArtworkAttributionClassFAQScreenQuery,
} from "app/Scenes/ArtworkAttributionClassFAQ/ArtworkAttributionClassFAQ"
import {
  ArtworkListScreen,
  ArtworkListScreenQuery,
  artworkListVariables,
} from "app/Scenes/ArtworkList/ArtworkList"
import { artworkListsQuery } from "app/Scenes/ArtworkLists/ArtworkLists"
import {
  ARTWORK_MEDIUM_QUERY,
  ArtworkMediumQueryRenderer,
} from "app/Scenes/ArtworkMedium/ArtworkMedium"
import { ArtworkRecommendationsScreen } from "app/Scenes/ArtworkRecommendations/ArtworkRecommendations"
import { AuctionBuyersPremiumQueryRenderer } from "app/Scenes/AuctionBuyersPremium/AuctionBuyersPremium"
import {
  AuctionResultQueryRenderer,
  AuctionResultScreenQuery,
} from "app/Scenes/AuctionResult/AuctionResult"
import {
  AuctionResultsForArtistsYouFollowPrefetchQuery,
  AuctionResultsForArtistsYouFollowQueryRenderer,
} from "app/Scenes/AuctionResults/AuctionResultsForArtistsYouFollow"
import { BottomTabType } from "app/Scenes/BottomTabs/BottomTabType"
import { CityFairListQueryRenderer, CityFairListScreenQuery } from "app/Scenes/City/CityFairList"
import { CitySavedListQueryRenderer, CitySavedListScreenQuery } from "app/Scenes/City/CitySavedList"
import {
  CitySectionListQueryRenderer,
  CitySectionListScreenQuery,
} from "app/Scenes/City/CitySectionList"
import { CityGuide } from "app/Scenes/CityGuide/CityGuide"
import { Collect, collectQuery, prepareCollectVariables } from "app/Scenes/Collect/Collect"
import { CollectionScreen, CollectionScreenQuery } from "app/Scenes/Collection/Collection"
import { CollectionFullFeaturedArtistListScreen } from "app/Scenes/Collection/Components/FullFeaturedArtistList"
import { CollectionsByCategory } from "app/Scenes/CollectionsByCategory/CollectionsByCategory"
import { collectionsByCategoryQuery } from "app/Scenes/CollectionsByCategory/Components/CollectionsByCategoryBody"
import { CompleteMyProfile } from "app/Scenes/CompleteMyProfile/CompleteMyProfile"
import { fairExhibitorsQuery } from "app/Scenes/Fair/Components/FairExhibitors"
import { FairScreen, FairScreenQuery } from "app/Scenes/Fair/Fair"
import {
  FairAllFollowedArtistsQueryRenderer,
  FairAllFollowedArtistsScreenQuery,
} from "app/Scenes/Fair/FairAllFollowedArtists"
import { FairArticlesQueryRenderer } from "app/Scenes/Fair/FairArticles"
import { FaireMoreInfoScreenQuery, FairMoreInfoQueryRenderer } from "app/Scenes/Fair/FairMoreInfo"
import { fairOverviewQuery } from "app/Scenes/Fair/FairOverview"
import { FeaturedFairsScreen, featuredFairsScreenQuery } from "app/Scenes/Fair/FeaturedFairsScreen"
import { Favorites } from "app/Scenes/Favorites/Favorites"
import { FeatureQueryRenderer, FeatureScreenQuery } from "app/Scenes/Feature/Feature"
import { GalleriesForYouScreen } from "app/Scenes/GalleriesForYou/GalleriesForYouScreen"
import { GeneQueryRenderer, GeneScreenQuery } from "app/Scenes/Gene/Gene"
import { HomeViewScreen, homeViewScreenQuery } from "app/Scenes/HomeView/HomeView"
import {
  HOME_SECTION_SCREEN_QUERY,
  HomeViewSectionScreenQueryRenderer,
} from "app/Scenes/HomeViewSectionScreen/HomeViewSectionScreen"
import {
  MakeOfferModalQueryRenderer,
  MakeOfferModalScreenQuery,
} from "app/Scenes/Inbox/Components/Conversations/MakeOfferModal"
import {
  PurchaseModalQueryRenderer,
  PurchaseModalScreenQuery,
} from "app/Scenes/Inbox/Components/Conversations/PurchaseModal"
import {
  ConversationQueryRenderer,
  ConversationScreenQuery,
} from "app/Scenes/Inbox/Screens/Conversation"
import {
  ConversationDetailsQueryRenderer,
  ConversationDetailsScreenQuery,
} from "app/Scenes/Inbox/Screens/ConversationDetails"
import {
  infiniteDiscoveryQuery,
  InfiniteDiscoveryQueryRenderer,
  infiniteDiscoveryVariables,
} from "app/Scenes/InfiniteDiscovery/InfiniteDiscoveryQueryRenderer"
import { MyAccountQueryRenderer, MyAccountScreenQuery } from "app/Scenes/MyAccount/MyAccount"
import { MyAccountDeleteAccountQueryRenderer } from "app/Scenes/MyAccount/MyAccountDeleteAccount"
import { MyAccountEditEmailQueryRenderer } from "app/Scenes/MyAccount/MyAccountEditEmail"
import { MyAccountEditPassword } from "app/Scenes/MyAccount/MyAccountEditPassword"
import { MyAccountEditPhoneQueryRenderer } from "app/Scenes/MyAccount/MyAccountEditPhone"
import {
  myAccountEditPriceRangeQuery,
  MyAccountEditPriceRangeQueryRenderer,
} from "app/Scenes/MyAccount/MyAccountEditPriceRange"
import { MyCollectionQueryRenderer } from "app/Scenes/MyCollection/MyCollection"
import { myCollectionArtworksQuery } from "app/Scenes/MyCollection/MyCollectionArtworks"
import { AddMyCollectionArtist } from "app/Scenes/MyCollection/Screens/Artist/AddMyCollectionArtist"
import {
  MyCollectionArtworkScreen,
  MyCollectionArtworkScreenQuery,
} from "app/Scenes/MyCollection/Screens/Artwork/MyCollectionArtwork"
import { MyCollectionArtworkAdd } from "app/Scenes/MyCollection/Screens/ArtworkForm/MyCollectionArtworkForm"
import { MyCollectionArtworkEditQueryRenderer } from "app/Scenes/MyCollection/Screens/ArtworkForm/Screens/MyCollectionArtworkEdit"
import { MyCollectionCollectedArtistsPrivacyQueryRenderer } from "app/Scenes/MyCollection/Screens/CollectedArtistsPrivacy/MyCollectionCollectedArtistsPrivacy"
import { AuctionResultsForArtistsYouCollect } from "app/Scenes/MyCollection/Screens/Insights/AuctionResultsForArtistsYouCollect"
import { CareerHighlightsBigCardsSwiper } from "app/Scenes/MyCollection/Screens/Insights/CareerHighlightsBigCardsSwiper"
import { MedianSalePriceAtAuction } from "app/Scenes/MyCollection/Screens/Insights/MedianSalePriceAtAuction"
import { MyCollectionAddCollectedArtistsScreen } from "app/Scenes/MyCollection/Screens/MyCollectionAddCollectedArtists/MyCollectionAddCollectedArtists"
import { UserAccountHeaderScreenQuery } from "app/Scenes/MyProfile/Components/UserAccountHeader/UserAccountHeader"
import { DarkModeSettings } from "app/Scenes/MyProfile/DarkModeSettings"
import {
  MyProfileEditFormScreen,
  MyProfileEditFormScreenQuery,
} from "app/Scenes/MyProfile/MyProfileEditForm"
import {
  myProfilePaymentQueryDefaultVariables,
  MyProfilePaymentQueryRenderer,
  MyProfilePaymentScreenQuery,
} from "app/Scenes/MyProfile/MyProfilePayment"
import { MyProfilePaymentNewCreditCard } from "app/Scenes/MyProfile/MyProfilePaymentNewCreditCard"
import { MyProfilePrivacy } from "app/Scenes/MyProfile/MyProfilePrivacy"
import { MyProfilePushNotificationsQueryRenderer } from "app/Scenes/MyProfile/MyProfilePushNotifications"
import { MyProfileSettings } from "app/Scenes/MyProfile/MyProfileSettings"
import { MyProfileTermsAndConditions } from "app/Scenes/MyProfile/MyProfileTermsAndConditions"
import { NewWorksForYouQueryRenderer } from "app/Scenes/NewWorksForYou/NewWorksForYou"
import { NewWorksFromGalleriesYouFollowScreenQuery } from "app/Scenes/NewWorksFromGalleriesYouFollow/Components/NewWorksFromGalleriesYouFollow"
import { NewWorksFromGalleriesYouFollowScreen } from "app/Scenes/NewWorksFromGalleriesYouFollow/NewWorksFromGalleriesYouFollow"
import { OrderDetailsQR } from "app/Scenes/OrderHistory/OrderDetails/OrderDetails"
import { OrderHistoryQueryRender } from "app/Scenes/OrderHistory/OrderHistory"
import { PartnerQueryRenderer, PartnerScreenQuery } from "app/Scenes/Partner/Partner"
import {
  PartnerLocationsQueryRenderer,
  PartnerLocationsScreenQuery,
} from "app/Scenes/Partner/Screens/PartnerLocations"
import { PartnerOfferContainer } from "app/Scenes/PartnerOffer/PartnerOfferContainer"
import { PriceDatabase } from "app/Scenes/PriceDatabase/PriceDatabase"
import { PrivacyRequest } from "app/Scenes/PrivacyRequest/PrivacyRequest"
import { RecentlyViewedScreenQuery } from "app/Scenes/RecentlyViewed/Components/RecentlyViewedArtworks"
import { RecentlyViewedScreen } from "app/Scenes/RecentlyViewed/RecentlyViewed"
import { RecommendedAuctionLotsQueryRenderer } from "app/Scenes/RecommendedAuctionLots/RecommendedAuctionLots"
import { SaleQueryRenderer, SaleScreenQuery } from "app/Scenes/Sale/Sale"
import { SaleInfoQueryRenderer } from "app/Scenes/SaleInfo/SaleInfo"
import { SalesScreen, SalesScreenQuery } from "app/Scenes/Sales/Sales"
import { SavedArtworks } from "app/Scenes/SavedArtworks/SavedArtworks"
import { AlertArtworks } from "app/Scenes/SavedSearchAlert/AlertArtworks"
import {
  EditSavedSearchAlertDetailsScreenQuery,
  EditSavedSearchAlertQueryRenderer,
} from "app/Scenes/SavedSearchAlert/EditSavedSearchAlert"
import { SavedSearchAlertScreenQuery } from "app/Scenes/SavedSearchAlert/SavedSearchAlert"
import { SavedSearchAlertsListQueryRenderer } from "app/Scenes/SavedSearchAlertsList/SavedSearchAlertsList"
import {
  searchQueryDefaultVariables,
  SearchScreen,
  SearchScreenQuery,
} from "app/Scenes/Search/Search"
import { discoverSomethingNewQuery } from "app/Scenes/Search/components/DiscoverSomethingNew/DiscoverSomethingNew"
import { exploreByCategoryQuery } from "app/Scenes/Search/components/ExploreByCategory/ExploreByCategory"
import {
  ShowMoreInfoQueryRenderer,
  ShowMoreInfoScreenQuery,
} from "app/Scenes/Show/Screens/ShowMoreInfo"
import { ShowQueryRenderer, ShowScreenQuery } from "app/Scenes/Show/Show"
import { ShowsForYouScreen } from "app/Scenes/Shows/ShowsForYou"
import {
  SimilarToRecentlyViewedScreen,
  SimilarToRecentlyViewedScreenQuery,
} from "app/Scenes/SimilarToRecentlyViewed/SimilarToRecentlyViewed"
import { TagQueryRenderer, TagScreenQuery } from "app/Scenes/Tag/Tag"
import {
  VanityURLEntityRenderer,
  VanityURLEntityScreenQuery,
} from "app/Scenes/VanityURL/VanityURLEntity"
import {
  ViewingRoomQueryRenderer,
  ViewingRoomScreenQuery,
} from "app/Scenes/ViewingRoom/ViewingRoom"
import {
  ViewingRoomArtworkScreen,
  ViewingRoomArtworkScreenQuery,
} from "app/Scenes/ViewingRoom/ViewingRoomArtwork"
import {
  ViewingRoomArtworksQueryRenderer,
  ViewingRoomArtworksScreenQuery,
} from "app/Scenes/ViewingRoom/ViewingRoomArtworks"
import {
  ViewingRoomsListScreen,
  viewingRoomsListScreenQuery,
} from "app/Scenes/ViewingRoom/ViewingRoomsList"
import { unsafe__getEnvironment } from "app/store/GlobalStore"
import { DevMenu } from "app/system/devTools/DevMenu/DevMenu"
import { goBack } from "app/system/navigation/navigate"
import { replaceParams } from "app/system/navigation/utils/replaceParams"
import { compact } from "lodash"
import { Platform } from "react-native"
import { GraphQLTaggedNode } from "react-relay"

export interface ViewOptions {
  alwaysPresentModally?: boolean
  hidesBottomTabs?: boolean
  // If this module is the root view of a particular tab, name it here
  isRootViewForTabName?: BottomTabType
  // If this module should only be shown in one particular tab, name it here
  onlyShowInTabName?: BottomTabType
  screenOptions?: NativeStackNavigationOptions
  topTabsNavigatorOptions?: {
    topTabName: string
  }
}
// Default WebView Route Definition
const webViewRoute = ({
  path,
  config,
  screenOptions,
}: {
  path: string
  config?: ArtsyWebViewConfig
  screenOptions?: NativeStackNavigationOptions
}) => {
  return {
    path,
    name: config?.alwaysPresentModally ? "ModalWebView" : "ReactWebView",
    Component: ArtsyWebViewPage,
    options: {
      alwaysPresentModally: config?.alwaysPresentModally,
      screenOptions: {
        gestureEnabled: false,
        headerShown: false,
        ...screenOptions,
      },
    },
    injectParams: (params: any) => ({
      url: replaceParams(path, params),
      isPresentedModally: !!config?.alwaysPresentModally,
      ...config,
    }),
  } as const
}

export type ModuleDescriptor<T = string> = {
  path: string
  name: T
  Component: React.ComponentType<any>
  options?: ViewOptions
  /**
   * If the route has a query, you can specify it here. The query will be used to prefetch data for the route.
   */
  queries?: GraphQLTaggedNode[]
  /**
   * Here variables can be specified for each query. The variables will be merged with the route params.
   */
  prepareVariables?: ((params: any) => object)[]
  injectParams?: (params: any) => any
}

// little helper function to make sure we get both intellisense and good type information on the result
function defineRoutes<T extends string>(obj: Array<ModuleDescriptor<T>>) {
  return obj
}

export type AppModule = (typeof artsyDotNetRoutes | typeof liveDotArtsyRoutes)[0]["name"]

export const artsyDotNetRoutes = defineRoutes([
  {
    path: "/",
    name: "Home",
    Component: HomeViewScreen,
    options: {
      isRootViewForTabName: "home",
      onlyShowInTabName: "home",
      screenOptions: {
        headerShown: false,
      },
    },
    queries: [homeViewScreenQuery],
  },
  {
    path: "/about",
    name: "About",
    Component: About,
    options: {
      screenOptions: {
        headerTitle: "About",
      },
    },
  },
  {
    path: "/notifications",
    name: "Activity",
    Component: ActivityScreen,
    options: {
      hidesBottomTabs: true,
      screenOptions: {
        headerShown: false,
      },
    },
    queries: [activityHeaderQuery, activityContentQuery],
  },
  {
    path: "/notification/:notificationID",
    name: "ActivityItem",
    Component: ActivityItemScreenQueryRenderer,
    options: {
      hidesBottomTabs: true,
      screenOptions: {
        headerShown: false,
      },
    },
    queries: [ActivityItemQuery],
  },
  {
    path: "/art-quiz",
    name: "ArtQuiz",
    Component: ArtQuiz,
    options: {
      screenOptions: {
        gestureEnabled: false,
        headerShown: false,
      },
      hidesBottomTabs: true,
    },
    queries: [ArtQuizScreenQuery],
  },
  {
    path: "/art-quiz/artworks",
    name: "ArtQuiz",
    Component: ArtQuiz,
    options: {
      screenOptions: {
        gestureEnabled: false,
      },
      hidesBottomTabs: true,
    },
    queries: [ArtQuizScreenQuery],
  },
  {
    path: "/art-quiz/results",
    name: "ArtQuizResults",
    Component: ArtQuizResults,
    options: {
      screenOptions: {
        animationTypeForReplace: "pop",
        headerShown: false,
      },
    },
    queries: [ArtQuizResultsScreenQuery],
  },
  {
    path: "/article/:articleID",
    name: "Article",
    Component: ArticleScreen,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
    queries: [articleScreenQuery],
  },
  {
    path: "/article/:articleID/slideshow",
    name: "ArticleSlideShow",
    Component: ArticlesSlideShowScreen,
    options: {
      hidesBottomTabs: true,
      screenOptions: {
        headerShown: false,
      },
    },
  },
  {
    path: "/articles",
    name: "Articles",
    Component: ArticlesScreen,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
    queries: [ArticlesScreenQuery],
  },
  {
    path: "/artist-series/:artistSeriesID",
    name: "ArtistSeries",
    Component: ArtistSeriesQueryRenderer,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
    queries: [ArtistSeriesScreenQuery],
  },
  {
    path: "/artist/:artistID",
    name: "Artist",
    Component: ArtistQueryRenderer,
    queries: [ArtistScreenQuery, artistArtworksQuery],
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
    prepareVariables: [({ artistID }) => ({ artistID, ...defaultArtistVariables })],
  },
  {
    path: "/artist/:artistID/articles",
    name: "ArtistArticles",
    Component: ArtistArticlesQueryRenderer,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
    queries: [ArtistArticlesResultScreenQuery],
  },
  {
    path: "/artist/:artistID/artist-series",
    name: "FullArtistSeriesList",
    Component: ArtistSeriesFullArtistSeriesListQueryRenderer,
    options: {
      screenOptions: {
        headerTitle: "Artist Series",
      },
    },
    queries: [ArtistSeriesFullArtistSeriesScreenQuery],
  },
  {
    path: "/artist/:artistID/auction-result/:auctionResultInternalID",
    name: "AuctionResult",
    Component: AuctionResultQueryRenderer,
    queries: [AuctionResultScreenQuery],
  },
  {
    path: "/artist/:artistID/auction-results",
    name: "Artist",
    Component: ArtistQueryRenderer,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
    queries: [ArtistScreenQuery],

    injectParams: (params) => ({
      ...params,
      initialTab: "Insights",
    }),
  },
  {
    path: "/artist/:artistID/artworks",
    name: "Artist",
    Component: ArtistQueryRenderer,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
    queries: [ArtistScreenQuery],
    injectParams: (params) => ({
      ...params,
      initialTab: "Artworks",
      scrollToArtworksGrid: true,
    }),
  },
  {
    path: "/artist/:artistID/shows",
    name: "ArtistShows",
    Component: ArtistShowsQueryRenderer,
    queries: [ArtistShowsScreenQuery],
  },
  // Routes `/artist/:artistID/*` and `"/:profile_id_ignored/artist/:artistID"`
  // MUST go together The following two
  {
    path: "/artist/:artistID/*",
    name: "Artist",
    Component: ArtistQueryRenderer,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
    queries: [ArtistScreenQuery],
  },
  {
    path: "/:profile_id_ignored/artist/:artistID",
    name: "Artist",
    Component: ArtistQueryRenderer,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
    queries: [ArtistScreenQuery],
  }, // For artists in a gallery context, like https://www.artsy.net/spruth-magers/artist/astrid-klein . Until we have a native // version of the gallery profile/context, we will use the normal native artist view instead of showing a web view.

  {
    path: "/artwork-certificate-of-authenticity",
    name: "ArtworkCertificateAuthenticity",
    Component: CertificateOfAuthenticity,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
  },
  {
    path: "/artwork-classifications",
    name: "ArtworkAttributionClassFAQ",
    Component: ArtworkAttributionClassFAQQueryRenderer,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
    queries: [ArtworkAttributionClassFAQScreenQuery],
  },
  {
    path: "/artwork-list/:listID",
    name: "ArtworkList",
    Component: ArtworkListScreen,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
    queries: [ArtworkListScreenQuery],
    prepareVariables: [({ listID }) => ({ listID, ...artworkListVariables })],
  },
  {
    path: "/artwork-recommendations",
    name: "ArtworkRecommendations",
    Component: ArtworkRecommendationsScreen,
    options: {
      screenOptions: {
        headerTitle: "Artwork Recommendations",
      },
    },
  },
  {
    path: "/artwork/:artworkID",
    name: "Artwork",
    Component: ArtworkScreen,
    options: {
      hidesBottomTabs: true,
    },
    queries: [ArtworkScreenQuery],
  },
  {
    path: "/artwork/:artworkID/medium",
    name: "ArtworkMedium",
    Component: ArtworkMediumQueryRenderer,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
    queries: [ARTWORK_MEDIUM_QUERY],
  },
  {
    path: "/artwork/:artworkID/browse-similar-works",
    name: "BrowseSimilarWorks",
    Component: BrowseSimilarWorksQueryRenderer,
    options: {
      hidesBottomTabs: true,
      screenOptions: {
        headerShown: false,
      },
    },
    queries: [BrowseSimilarWorksScreenQuery],
  },
  {
    path: "/auction-registration/:saleID",
    name: "AuctionRegistration",
    Component: RegistrationFlow,
    options: {
      alwaysPresentModally: true,
      screenOptions: {
        // Don't allow the screen to be swiped away by mistake
        gestureEnabled: false,
        headerShown: false,
      },
    },
  },
  {
    path: "/auction-results-for-artists-you-collect",
    name: "AuctionResultsForArtistsYouCollect",
    Component: AuctionResultsForArtistsYouCollect,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
  },
  {
    path: "/auction-results-for-artists-you-follow",
    name: "AuctionResultsForArtistsYouFollow",
    Component: AuctionResultsForArtistsYouFollowQueryRenderer,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
    queries: [AuctionResultsForArtistsYouFollowPrefetchQuery],
  },
  {
    path: "/auction/:saleID",
    name: "Auction",
    Component: SaleQueryRenderer,
    options: { screenOptions: { headerShown: false } },
    queries: [SaleScreenQuery],
    prepareVariables: [({ saleID }) => ({ saleID, saleSlug: saleID })],
  },
  {
    path: "/auction/:saleID/bid/:artworkID",
    name: "AuctionBidArtwork",
    Component: BidFlow,
    options: {
      alwaysPresentModally: true,
      screenOptions: {
        headerShown: false,
      },
    },
  },
  {
    path: "/auction/:saleID/buyers-premium",
    name: "AuctionBuyersPremium",
    Component: AuctionBuyersPremiumQueryRenderer,
  },
  {
    path: "/auction/:saleID/info",
    name: "AuctionInfo",
    Component: SaleInfoQueryRenderer,
  },
  {
    path: "/auctions",
    name: "Auctions",
    Component: SalesScreen,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
    queries: [SalesScreenQuery],
  },
  {
    path: "/auctions/lots-for-you-ending-soon",
    name: "RecommendedAuctionLots",
    Component: RecommendedAuctionLotsQueryRenderer,
    options: {
      hidesBottomTabs: true,
      screenOptions: {
        headerShown: false,
      },
    },
  },
  {
    path: "/city-fair/:citySlug",
    name: "CityFairList",
    Component: CityFairListQueryRenderer,
    queries: [CityFairListScreenQuery],
  },
  {
    path: "/city-save/:citySlug",
    name: "CitySavedList",
    Component: CitySavedListQueryRenderer,
    queries: [CitySavedListScreenQuery],
  },
  {
    path: "/city/:citySlug/:section",
    name: "CitySectionList",
    Component: CitySectionListQueryRenderer,
    queries: [CitySectionListScreenQuery],
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
  },
  {
    path: "/collect",
    name: "Collect",
    Component: Collect,
    queries: [collectQuery],
    prepareVariables: [(props) => prepareCollectVariables(props)],
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
  },
  {
    path: "/collections-by-category/:slug",
    name: "CollectionsByCategory",
    Component: CollectionsByCategory,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
    queries: [collectionsByCategoryQuery],
  },
  {
    path: "/collection/:collectionID",
    name: "Collection",
    Component: CollectionScreen,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
    queries: [CollectionScreenQuery],
  },
  {
    path: "/collection/:collectionID/artists",
    name: "FullFeaturedArtistList",
    Component: CollectionFullFeaturedArtistListScreen,
    options: {
      screenOptions: {
        headerTitle: "Featured Artists",
      },
    },
  },
  {
    path: "/conversation/:conversationID",
    name: "Conversation",
    Component: ConversationQueryRenderer,
    options: {
      onlyShowInTabName: "inbox",
      screenOptions: {
        headerShown: false,
      },
    },
    queries: [ConversationScreenQuery],
  },
  {
    path: "/conversation/:conversationID/details",
    name: "ConversationDetails",
    Component: ConversationDetailsQueryRenderer,
    options: {
      screenOptions: {
        headerTitle: "Details",
      },
    },
    queries: [ConversationDetailsScreenQuery],
  },
  {
    path: "/dev-menu",
    name: "DevMenu",
    Component: DevMenu,
    options: {
      alwaysPresentModally: true,
      screenOptions: {
        headerTitle: "Dev Settings",
        headerLargeTitle: true,
        headerLeft: () => {
          return <Flex />
        },
      },
    },
  },
  {
    path: "/fair/:fairID",
    name: "Fair",
    Component: FairScreen,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
    queries: [FairScreenQuery, fairOverviewQuery, fairExhibitorsQuery],
    prepareVariables: [({ fairID }) => ({ fairID })],
  },
  {
    path: "/fair/:fairID/articles",
    name: "FairArticles",
    Component: FairArticlesQueryRenderer,
    options: {
      screenOptions: {
        headerTitle: "Articles",
      },
    },
  },
  {
    path: "/fair/:fairID/artists",
    name: "Fair",
    Component: FairScreen,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
    queries: [FairScreenQuery],
  },
  {
    path: "/fair/:fairID/artworks",
    name: "Fair",
    Component: FairScreen,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
    queries: [FairScreenQuery],
  },
  {
    path: "/fair/:fairID/exhibitors",
    name: "Fair",
    Component: FairScreen,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
    queries: [FairScreenQuery],
  },
  {
    path: "/fair/:fairID/followedArtists",
    name: "FairAllFollowedArtists",
    Component: FairAllFollowedArtistsQueryRenderer,
    options: {
      screenOptions: {
        headerTitle: "Artworks",
      },
    },
    queries: [FairAllFollowedArtistsScreenQuery],
  },
  {
    path: "/fair/:fairID/info",
    name: "FairMoreInfo",
    Component: FairMoreInfoQueryRenderer,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
    queries: [FaireMoreInfoScreenQuery],
  },
  {
    path: "/featured-fairs",
    name: "Featured Fairs",
    Component: FeaturedFairsScreen,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
    queries: [featuredFairsScreenQuery],
  },
  {
    path: "/feature/:slug",
    name: "Feature",
    Component: FeatureQueryRenderer,
    queries: [FeatureScreenQuery],
  },
  {
    path: "/galleries-for-you",
    name: "GalleriesForYou",
    Component: GalleriesForYouScreen,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
  },
  {
    path: "/gene/:geneID",
    name: "Gene",
    Component: GeneQueryRenderer,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
    queries: [GeneScreenQuery],
  },
  {
    path: "/home-view/sections/:id",
    name: "HomeViewSectionScreen",
    Component: HomeViewSectionScreenQueryRenderer,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
    queries: [HOME_SECTION_SCREEN_QUERY],
  },
  {
    path: "/inbox",
    name: "Inbox",
    Component: InboxScreen,
    options: {
      isRootViewForTabName: "inbox",
      onlyShowInTabName: "inbox",
      screenOptions: {
        headerShown: false,
      },
    },
    queries: [InboxScreenQuery],
  },
  {
    path: "/infinite-discovery",
    name: "InfiniteDiscovery",
    Component: InfiniteDiscoveryQueryRenderer,
    queries: [infiniteDiscoveryQuery],
    prepareVariables: [() => infiniteDiscoveryVariables],
    options: {
      hidesBottomTabs: true,
      screenOptions: {
        animation: "slide_from_bottom",
        gestureEnabled: false,
        headerShown: false,
      },
    },
  },
  {
    path: "/inquiry/:artworkID",
    name: "Inquiry",
    Component: InquiryQueryRenderer,
    options: {
      alwaysPresentModally: true,
      screenOptions: {
        headerShown: false,
      },
    },
  },
  {
    path: "/local-discovery",
    name: "LocalDiscovery",
    Component: CityGuide,
    options: {
      screenOptions: {
        headerTransparent: true,
        headerShadowVisible: false,
        headerLeft: () => {
          return (
            <Flex
              borderRadius={BACK_BUTTON_SIZE_SIZE / 2}
              backgroundColor="mono0"
              width={BACK_BUTTON_SIZE_SIZE}
              height={BACK_BUTTON_SIZE_SIZE}
              justifyContent="center"
              alignItems="center"
            >
              <BackButton
                style={{
                  top: 0,
                  left: 0,
                }}
                onPress={() => {
                  goBack()
                }}
              />
            </Flex>
          )
        },
      },
    },
  },
  {
    path: "/make-offer/:artworkID",
    name: "MakeOfferModal",
    Component: MakeOfferModalQueryRenderer,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
    queries: [MakeOfferModalScreenQuery],
  },
  {
    path: "/my-account",
    name: "MyAccount",
    Component: MyAccountQueryRenderer,
    options: {
      screenOptions: {
        headerTitle: "Account Settings",
        headerShown: false,
      },
    },
    queries: [MyAccountScreenQuery],
  },
  {
    path: "/my-account/dark-mode",
    name: "DarkModeSettings",
    Component: DarkModeSettings,
    options: {
      screenOptions: {
        headerShown: false,
        headerTitle: "Dark Mode",
      },
      hidesBottomTabs: true,
    },
  },
  {
    path: "/my-account/delete-account",
    name: "MyAccountDeleteAccount",
    Component: MyAccountDeleteAccountQueryRenderer,
  },
  {
    path: "/my-account/edit-email",
    name: "MyAccountEditEmail",
    Component: MyAccountEditEmailQueryRenderer,
    options: {
      screenOptions: {
        headerShown: false,
        headerTitle: "Email",
      },
    },
  },
  {
    path: "/my-account/edit-password",
    name: "MyAccountEditPassword",
    Component: MyAccountEditPassword,
    options: {
      screenOptions: {
        headerShown: false,
        headerTitle: "Password",
      },
    },
  },
  {
    path: "/my-account/edit-phone",
    name: "MyAccountEditPhone",
    Component: MyAccountEditPhoneQueryRenderer,
    options: {
      screenOptions: {
        headerShown: false,
        headerTitle: "Phone Number",
      },
    },
  },
  {
    path: "/my-account/edit-price-range",
    name: "MyAccountEditPriceRange",
    Component: MyAccountEditPriceRangeQueryRenderer,
    queries: [myAccountEditPriceRangeQuery],
    options: {
      screenOptions: {
        headerShown: false,
        headerTitle: "Price Range",
      },
    },
  },
  {
    path: "/my-collection",
    name: "MyCollection",
    Component: MyCollectionQueryRenderer,
    queries: [myCollectionArtworksQuery],
    options: {
      screenOptions: {
        headerShown: false,
      },
      onlyShowInTabName: "profile",
    },
  },
  {
    path: "/my-collection/artists/new",
    name: "AddMyCollectionArtist",
    Component: AddMyCollectionArtist,
    options: {
      screenOptions: {
        headerTitle: "Add New Artist",
      },
    },
    injectParams: (params) => ({
      ...params,
      useNativeHeader: true,
    }),
  },
  {
    path: "/my-collection/artwork/:artworkId",
    name: "MyCollectionArtwork",
    Component: MyCollectionArtworkScreen,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
    prepareVariables: [
      ({ artworkId, artistInternalID, medium }) => ({
        artworkId,
        artistInternalID,
        medium,
      }),
    ],
    queries: [MyCollectionArtworkScreenQuery],
  },
  {
    path: "/my-collection/artworks/:artworkID/edit",
    name: "MyCollectionArtworkEdit",
    Component: MyCollectionArtworkEditQueryRenderer,
    options: {
      alwaysPresentModally: true,
      screenOptions: {
        gestureEnabled: false,
        headerShown: false,
      },
    },
  },
  {
    path: "/my-collection/artworks/new",
    name: "MyCollectionArtworkAdd",
    Component: MyCollectionArtworkAdd,
    options: {
      alwaysPresentModally: true,
      screenOptions: {
        gestureEnabled: false,
        headerShown: false,
      },
    },
  },
  {
    path: "/my-collection/collected-artists/new",
    name: "MyCollectionAddCollectedArtists",
    Component: MyCollectionAddCollectedArtistsScreen,
    options: {
      hidesBottomTabs: true,
      screenOptions: {
        headerTitle: "Add Artists You Collect",
        gestureEnabled: false,
      },
    },
  },
  {
    path: "/my-collection/career-highlights",
    name: "CareerHighlightsBigCardsSwiper",
    Component: CareerHighlightsBigCardsSwiper,
    options: {
      hidesBottomTabs: true,
      screenOptions: {
        headerShown: false,
      },
    },
  },
  {
    path: "/my-collection/median-sale-price-at-auction/:artistID",
    name: "MedianSalePriceAtAuction",
    Component: MedianSalePriceAtAuction,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
  },
  {
    path: "/my-collection/collected-artists/privacy-settings",
    name: "MyCollectionCollectedArtistsPrivacy",
    Component: MyCollectionCollectedArtistsPrivacyQueryRenderer,
    options: {
      hidesBottomTabs: true,
      screenOptions: {
        gestureEnabled: false,
        headerShown: false,
      },
    },
  },
  {
    path: "/complete-my-profile",
    name: "CompleteMyProfile",
    Component: CompleteMyProfile,
    options: {
      hidesBottomTabs: true,
      screenOptions: {
        headerShown: false,
      },
    },
  },
  {
    path: "/my-profile",
    name: "MyProfile",
    Component: MyProfileSettings,
    options: {
      isRootViewForTabName: "profile",
      onlyShowInTabName: "profile",
      screenOptions: {
        headerShown: false,
      },
    },
    queries: [UserAccountHeaderScreenQuery],
  },
  {
    path: "/my-profile/edit",
    name: "MyProfileEditForm",
    Component: MyProfileEditFormScreen,
    options: {
      screenOptions: {
        headerTitle: "Edit Profile",
      },
    },
    queries: [MyProfileEditFormScreenQuery],
  },
  {
    path: "/my-profile/payment",
    name: "MyProfilePayment",
    Component: MyProfilePaymentQueryRenderer,
    options: {
      screenOptions: {
        headerTitle: "Payment",
        headerShown: false,
      },
    },
    prepareVariables: [() => myProfilePaymentQueryDefaultVariables],
    queries: [MyProfilePaymentScreenQuery],
  },
  {
    path: "/my-profile/payment/new-card",
    name: "MyProfilePaymentNewCreditCard",
    Component: MyProfilePaymentNewCreditCard,
    options: {
      screenOptions: {
        headerTitle: "Add new card",
        headerShown: false,
      },
    },
  },
  {
    path: "/my-profile/push-notifications",
    name: "MyProfilePushNotifications",
    Component: MyProfilePushNotificationsQueryRenderer,
    options: {
      screenOptions: {
        headerShown: false,
        headerTitle: "Push Notifications",
      },
    },
  },
  {
    path: "/my-profile/privacy",
    name: "MyProfilePrivacy",
    Component: MyProfilePrivacy,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
  },
  {
    path: "/my-profile/terms-and-conditions",
    name: "MyProfileTermsAndConditions",
    Component: MyProfileTermsAndConditions,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
  },
  {
    path: "/news",
    name: "News",
    Component: NewsScreen,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
    queries: [NewsScreenQuery],
  },
  {
    path: "/new-for-you",
    name: "NewWorksForYou",
    Component: NewWorksForYouQueryRenderer,
    options: {
      hidesBottomTabs: true,
      screenOptions: {
        headerShown: false,
      },
    },
  },
  {
    path: "/new-works-from-galleries-you-follow",
    name: "NewWorksFromGalleriesYouFollow",
    Component: NewWorksFromGalleriesYouFollowScreen,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
    queries: [NewWorksFromGalleriesYouFollowScreenQuery],
  },
  {
    path: "/orders",
    name: "OrderHistory",
    Component: OrderHistoryQueryRender,
    options: {
      screenOptions: {
        headerTitle: "Order History",
      },
    },
  },
  {
    path: "/partner-locations/:partnerID",
    name: "PartnerLocations",
    Component: PartnerLocationsQueryRenderer,
    queries: [PartnerLocationsScreenQuery],
  },
  {
    path: "/partner-offer/:partnerOfferID/checkout",
    name: "PartnerOfferContainer",
    Component: PartnerOfferContainer,
    options: {
      hidesBottomTabs: true,
      screenOptions: {
        headerShown: false,
      },
    },
  },
  {
    path: "/partner/:partnerID",
    name: "Partner",
    Component: PartnerQueryRenderer,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
    queries: [PartnerScreenQuery],
  },
  {
    path: "/partner/:partnerID/artists/:artistID",
    name: "Artist",
    Component: ArtistQueryRenderer,
    queries: [ArtistScreenQuery, artistArtworksQuery],
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
    prepareVariables: [({ artistID }) => ({ artistID, ...defaultArtistVariables })],
  },
  {
    path: "/partner/:partnerID/shows",
    name: "Partner",
    Component: PartnerQueryRenderer,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
    injectParams: (params) => ({
      ...params,
      initialTab: "Shows",
    }),
  },
  {
    path: "/partner/:partnerID/works",
    name: "Partner",
    Component: PartnerQueryRenderer,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
    injectParams: (params) => ({
      ...params,
      initialTab: "Artworks",
    }),
  },

  {
    path: "/price-database",
    name: "PriceDatabase",
    Component: PriceDatabase,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
  },
  {
    path: "/privacy-request",
    name: "PrivacyRequest",
    Component: PrivacyRequest,
    options: {
      screenOptions: {
        headerShown: false,
        headerTitle: "Personal Data Request",
      },
    },
  },
  {
    path: "/purchase/:artworkID",
    name: "PurchaseModal",
    Component: PurchaseModalQueryRenderer,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
    queries: [PurchaseModalScreenQuery],
  },
  {
    path: "/recently-viewed",
    name: "RecentlyViewed",
    Component: RecentlyViewedScreen,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
    queries: [RecentlyViewedScreenQuery],
  },
  {
    path: "/search",
    name: "Search",
    Component: SearchScreen,
    options: {
      isRootViewForTabName: "search",
      onlyShowInTabName: "search",
      screenOptions: {
        headerShown: false,
      },
    },
    queries: [SearchScreenQuery, exploreByCategoryQuery, discoverSomethingNewQuery],
    prepareVariables: [() => searchQueryDefaultVariables],
  },
  {
    path: "/favorites",
    name: "Favorites",
    Component: Favorites,
    options: {
      isRootViewForTabName: "favorites",
      onlyShowInTabName: "favorites",
      screenOptions: {
        headerShown: false,
      },
    },
  },
  {
    path: "/favorites/alerts",
    name: "SavedSearchAlertsList",
    Component: SavedSearchAlertsListQueryRenderer,
    options: {
      topTabsNavigatorOptions: {
        topTabName: "alerts",
      },
      isRootViewForTabName: "favorites",
      onlyShowInTabName: "favorites",
      screenOptions: {
        headerShown: false,
      },
    },
  },
  {
    path: "/favorites/alerts/:savedSearchAlertId/edit",
    name: "EditSavedSearchAlert",
    Component: EditSavedSearchAlertQueryRenderer,
    options: {
      hidesBottomTabs: true,
      screenOptions: {
        headerShown: false,
      },
    },
    queries: [SavedSearchAlertScreenQuery, EditSavedSearchAlertDetailsScreenQuery],
  },
  {
    path: "/favorites/alerts/:alertId/artworks",
    name: "AlertArtworks",
    Component: AlertArtworks,
    options: {
      hidesBottomTabs: true,
      screenOptions: {
        headerShown: false,
      },
    },
  },
  {
    path: "/favorites/follows",
    name: "SavedArtworks",
    Component: SavedArtworks,
    options: {
      topTabsNavigatorOptions: {
        topTabName: "follows",
      },
      isRootViewForTabName: "favorites",
      onlyShowInTabName: "favorites",
      screenOptions: {
        headerShown: false,
      },
    },
    queries: [artworkListsQuery],
    prepareVariables: [() => artworkListVariables],
  },
  {
    path: "/favorites/saves",
    name: "SavedArtworks",
    Component: SavedArtworks,
    options: {
      topTabsNavigatorOptions: {
        topTabName: "saves",
      },
      isRootViewForTabName: "favorites",
      onlyShowInTabName: "favorites",
      screenOptions: {
        headerShown: false,
      },
    },
    queries: [artworkListsQuery],
    prepareVariables: [() => artworkListVariables],
  },
  {
    path: "/favorites/saves/:listID",
    name: "ArtworkList",
    Component: ArtworkListScreen,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
  },
  {
    path: "/show/:showID",
    name: "Show",
    Component: ShowQueryRenderer,
    queries: [ShowScreenQuery],
  },
  {
    path: "/show/:showID/info",
    name: "ShowMoreInfo",
    Component: ShowMoreInfoQueryRenderer,
    queries: [ShowMoreInfoScreenQuery],
  },
  {
    path: "/shows-for-you",
    name: "ShowsForYou",
    Component: ShowsForYouScreen,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
    //Not prefetching the query for now because it's dependent on the user's location.
    queries: [],
  },
  {
    path: "/similar-to-recently-viewed",
    name: "SimilarToRecentlyViewed",
    Component: SimilarToRecentlyViewedScreen,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
    queries: [SimilarToRecentlyViewedScreenQuery],
  },
  {
    path: "/tag/:tagID",
    name: "Tag",
    Component: TagQueryRenderer,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
    queries: [TagScreenQuery],
  },
  {
    path: "/unlisted-artworks-faq",
    name: "UnlistedArtworksFAQScreen",
    Component: UnlistedArtworksFAQScreen,
    options: {
      screenOptions: {
        headerTitle: "Private Listings",
      },
    },
  },
  {
    path: "/user/conversations/:conversationID",
    name: "Conversation",
    Component: ConversationQueryRenderer,
    options: {
      onlyShowInTabName: "inbox",
      screenOptions: {
        headerShown: false,
      },
    },
    queries: [ConversationScreenQuery],
  },
  {
    path: "/orders/:orderID/details",
    name: "OrderDetail",
    Component: OrderDetailsQR,
    options: {
      screenOptions: {
        headerTitle: "Order Details",
      },
    },
  },
  {
    path: "/user/purchases/:orderID",
    name: "OrderDetails",
    Component: OrderDetailsQR,
    options: {
      screenOptions: {
        headerTitle: "Order Details",
      },
    },
  },
  {
    path: "/viewing-room/:viewingRoomID",
    name: "ViewingRoom",
    Component: ViewingRoomQueryRenderer,
    queries: [ViewingRoomScreenQuery],
  },
  {
    path: "/viewing-room/:viewingRoomID/artworks",
    name: "ViewingRoomArtworks",
    Component: ViewingRoomArtworksQueryRenderer,
    queries: [ViewingRoomArtworksScreenQuery],
  },
  {
    path: "/viewing-room/:viewingRoomID/:artwork_id",
    name: "ViewingRoomArtwork",
    Component: ViewingRoomArtworkScreen,
    queries: [ViewingRoomArtworkScreenQuery],
  },
  {
    path: "/viewing-rooms",
    name: "ViewingRooms",
    Component: ViewingRoomsListScreen,
    queries: [viewingRoomsListScreenQuery],
    options: {
      screenOptions: {
        headerTitle: "Viewing Rooms",
      },
    },
  },
  {
    path: "/works-for-you",
    name: "WorksForYou",
    Component: WorksForYouQueryRenderer,
    queries: [WorksForYouScreenQuery],
  },
  webViewRoute({
    path: "/artists",
    screenOptions: {
      headerShown: false,
    },
  }),
  webViewRoute({
    path: "/galleries",
    screenOptions: {
      headerShown: false,
    },
  }),
  webViewRoute({
    path: "/auction-faq",
    config: {
      alwaysPresentModally: true,
    },
  }),
  webViewRoute({ path: "/buy-now-feature-faq" }),
  webViewRoute({ path: "/buyer-guarantee" }),
  webViewRoute({ path: "/categories" }),
  webViewRoute({
    path: "/conditions-of-sale",
    config: {
      alwaysPresentModally: true,
    },
  }),
  webViewRoute({ path: "/identity-verification-faq" }),
  webViewRoute({ path: "/meet-the-specialists" }),
  webViewRoute({
    path: "/orders/:orderID",
    config: {
      mimicBrowserBackButton: true,
      useRightCloseButton: true,
      alwaysPresentModally: true,
    },
  }),
  webViewRoute({ path: "/price-database" }),
  webViewRoute({
    path: "/privacy",
    config: {
      alwaysPresentModally: true,
    },
  }),
  webViewRoute({
    path: "/terms",
    config: {
      alwaysPresentModally: true,
    },
  }),
  webViewRoute({
    path: "/supplemental-cos",
    config: {
      alwaysPresentModally: true,
    },
  }),
  webViewRoute({ path: "/unsubscribe" }),

  // Every other route needs to go above
  {
    path: "/:slug",
    name: "VanityURLEntity",
    Component: VanityURLEntityRenderer,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
    queries: [VanityURLEntityScreenQuery],
  },
  webViewRoute({
    path: "/*",
    screenOptions: {
      headerShown: false,
    },
  }),
])

export const liveDotArtsyRoutes = defineRoutes([
  Platform.OS === "ios"
    ? {
        path: "/*",
        name: "LiveAuction",
        Component: LiveAuctionView,
        options: {
          alwaysPresentModally: true,
          hidesBottomTabs: true,
          screenOptions: {
            gestureEnabled: false,
            headerShown: false,
          },
        },
        injectParams: (params) => ({ slug: params["*"] }),
      }
    : {
        path: "/*",
        name: "LiveAuctionWebView",
        Component: ArtsyWebViewPage,
        options: {
          alwaysPresentModally: true,
          hidesBottomTabs: true,
          screenOptions: {
            gestureEnabled: false,
            headerShown: false,
          },
        },
        injectParams: (params) => ({
          url: unsafe__getEnvironment().predictionURL + "/" + params["*"],
        }),
      },
])

export const routes = compact([...artsyDotNetRoutes, ...liveDotArtsyRoutes])
