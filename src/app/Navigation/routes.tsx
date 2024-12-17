import { BackButton, Flex } from "@artsy/palette-mobile"
import { NativeStackNavigationOptions } from "@react-navigation/native-stack"
import { ArtsyWebViewConfig, ArtsyWebViewPage } from "app/Components/ArtsyWebView"
import { BidFlow } from "app/Components/Containers/BidFlow"
import { InboxQueryRenderer, InboxScreenQuery } from "app/Components/Containers/Inbox"
import { InquiryQueryRenderer } from "app/Components/Containers/Inquiry"
import { RegistrationFlow } from "app/Components/Containers/RegistrationFlow"
import {
  WorksForYouQueryRenderer,
  WorksForYouScreenQuery,
} from "app/Components/Containers/WorksForYou"
import { CityGuideView } from "app/NativeModules/CityGuideView"
import { LiveAuctionView } from "app/NativeModules/LiveAuctionView"
import { About } from "app/Scenes/About/About"
import { activityContentQuery } from "app/Scenes/Activity/ActivityContent"
import {
  ActivityItemQuery,
  ActivityItemScreenQueryRenderer,
} from "app/Scenes/Activity/ActivityItemScreen"
import { ActivityScreen } from "app/Scenes/Activity/ActivityScreen"
import { activityHeaderQuery } from "app/Scenes/Activity/components/ActivityHeader"
import { ArtQuiz } from "app/Scenes/ArtQuiz/ArtQuiz"
import { ArtQuizResults } from "app/Scenes/ArtQuiz/ArtQuizResults/ArtQuizResults"
import { ArticleScreen } from "app/Scenes/Article/ArticleScreen"
import { ArticlesSlideShowScreen } from "app/Scenes/ArticleSlideShow/ArticleSlideShow"
import { ArticlesScreen, ArticlesScreenQuery } from "app/Scenes/Articles/Articles"
import { NewsScreen, NewsScreenQuery } from "app/Scenes/Articles/News/News"
import { ArtistQueryRenderer, ArtistScreenQuery } from "app/Scenes/Artist/Artist"
import { ArtistArticlesQueryRenderer } from "app/Scenes/ArtistArticles/ArtistArticles"
import { ArtistSeriesQueryRenderer } from "app/Scenes/ArtistSeries/ArtistSeries"
import { ArtistSeriesFullArtistSeriesListQueryRenderer } from "app/Scenes/ArtistSeries/ArtistSeriesFullArtistSeriesList"
import { ArtistShows2QueryRenderer } from "app/Scenes/ArtistShows/ArtistShows2"
import { ArtworkScreen, ArtworkScreenQuery } from "app/Scenes/Artwork/Artwork"
import { BrowseSimilarWorksQueryRenderer } from "app/Scenes/Artwork/Components/BrowseSimilarWorks/BrowseSimilarWorks"
import { CertificateOfAuthenticity } from "app/Scenes/Artwork/Components/CertificateAuthenticity"
import { UnlistedArtworksFAQScreen } from "app/Scenes/Artwork/Components/UnlistedArtworksFAQScreen"
import { ArtworkAttributionClassFAQQueryRenderer } from "app/Scenes/ArtworkAttributionClassFAQ/ArtworkAttributionClassFAQ"
import { ArtworkListScreen } from "app/Scenes/ArtworkList/ArtworkList"
import { ArtworkMediumQueryRenderer } from "app/Scenes/ArtworkMedium/ArtworkMedium"
import { ArtworkRecommendationsScreen } from "app/Scenes/ArtworkRecommendations/ArtworkRecommendations"
import { AuctionBuyersPremiumQueryRenderer } from "app/Scenes/AuctionBuyersPremium/AuctionBuyersPremium"
import { AuctionResultQueryRenderer } from "app/Scenes/AuctionResult/AuctionResult"
import {
  AuctionResultsForArtistsYouFollowPrefetchQuery,
  AuctionResultsForArtistsYouFollowQueryRenderer,
} from "app/Scenes/AuctionResults/AuctionResultsForArtistsYouFollow"
import { BottomTabType } from "app/Scenes/BottomTabs/BottomTabType"
import { CityFairListQueryRenderer } from "app/Scenes/City/CityFairList"
import { CitySavedListQueryRenderer } from "app/Scenes/City/CitySavedList"
import { CitySectionListQueryRenderer } from "app/Scenes/City/CitySectionList"
import { CollectionScreen } from "app/Scenes/Collection/Collection"
import { CollectionFullFeaturedArtistListQueryRenderer } from "app/Scenes/Collection/Components/FullFeaturedArtistList"
import { CollectionsByCategory } from "app/Scenes/CollectionsByCategory/CollectionsByCategory"
import { CompleteMyProfile } from "app/Scenes/CompleteMyProfile/CompleteMyProfile"
import { FairScreen, FairScreenQuery } from "app/Scenes/Fair/Fair"
import { FairAllFollowedArtistsQueryRenderer } from "app/Scenes/Fair/FairAllFollowedArtists"
import { FairArticlesQueryRenderer } from "app/Scenes/Fair/FairArticles"
import { FairMoreInfoQueryRenderer } from "app/Scenes/Fair/FairMoreInfo"
import { Favorites } from "app/Scenes/Favorites/Favorites"
import { FeatureQueryRenderer } from "app/Scenes/Feature/Feature"
import { GalleriesForYouScreen } from "app/Scenes/GalleriesForYou/GalleriesForYouScreen"
import { GeneQueryRenderer } from "app/Scenes/Gene/Gene"
import { HomeViewScreen, homeViewScreenQuery } from "app/Scenes/HomeView/HomeView"
import { HomeViewSectionScreenQueryRenderer } from "app/Scenes/HomeViewSectionScreen/HomeViewSectionScreen"
import { MakeOfferModalQueryRenderer } from "app/Scenes/Inbox/Components/Conversations/MakeOfferModal"
import { PurchaseModalQueryRenderer } from "app/Scenes/Inbox/Components/Conversations/PurchaseModal"
import { ConversationQueryRenderer } from "app/Scenes/Inbox/Screens/Conversation"
import { ConversationDetailsQueryRenderer } from "app/Scenes/Inbox/Screens/ConversationDetails"
import { InfiniteDiscoveryQueryRenderer } from "app/Scenes/InfiniteDiscovery/InfiniteDiscovery"
import { MyAccountQueryRenderer } from "app/Scenes/MyAccount/MyAccount"
import { MyAccountDeleteAccountQueryRenderer } from "app/Scenes/MyAccount/MyAccountDeleteAccount"
import { MyAccountEditEmailQueryRenderer } from "app/Scenes/MyAccount/MyAccountEditEmail"
import { MyAccountEditPassword } from "app/Scenes/MyAccount/MyAccountEditPassword"
import { MyAccountEditPhoneQueryRenderer } from "app/Scenes/MyAccount/MyAccountEditPhone"
import { MyAccountEditPriceRangeQueryRenderer } from "app/Scenes/MyAccount/MyAccountEditPriceRange"
import {
  MyCollectionQueryRenderer,
  MyCollectionScreenQuery,
} from "app/Scenes/MyCollection/MyCollection"
import { AddMyCollectionArtist } from "app/Scenes/MyCollection/Screens/Artist/AddMyCollectionArtist"
import { RequestForPriceEstimateConfirmationScreen } from "app/Scenes/MyCollection/Screens/Artwork/Components/ArtworkInsights/RequestForPriceEstimate/RequestForPriceEstimateConfirmationScreen"
import { RequestForPriceEstimateScreen } from "app/Scenes/MyCollection/Screens/Artwork/Components/ArtworkInsights/RequestForPriceEstimate/RequestForPriceEstimateScreen"
import {
  MyCollectionArtworkScreen,
  MyCollectionArtworkScreenQuery,
} from "app/Scenes/MyCollection/Screens/Artwork/MyCollectionArtwork"
import { MyCollectionSellingWithArtsyFAQ } from "app/Scenes/MyCollection/Screens/Artwork/MyCollectionSellingWithartsyFAQ"
import { MyCollectionArtworkAdd } from "app/Scenes/MyCollection/Screens/ArtworkForm/MyCollectionArtworkForm"
import { MyCollectionArtworkEditQueryRenderer } from "app/Scenes/MyCollection/Screens/ArtworkForm/Screens/MyCollectionArtworkEdit"
import { MyCollectionCollectedArtistsPrivacyQueryRenderer } from "app/Scenes/MyCollection/Screens/CollectedArtistsPrivacy/MyCollectionCollectedArtistsPrivacy"
import { AuctionResultsForArtistsYouCollect } from "app/Scenes/MyCollection/Screens/Insights/AuctionResultsForArtistsYouCollect"
import { CareerHighlightsBigCardsSwiper } from "app/Scenes/MyCollection/Screens/Insights/CareerHighlightsBigCardsSwiper"
import { MedianSalePriceAtAuction } from "app/Scenes/MyCollection/Screens/Insights/MedianSalePriceAtAuction"
import { MyCollectionAddCollectedArtistsScreen } from "app/Scenes/MyCollection/Screens/MyCollectionAddCollectedArtists/MyCollectionAddCollectedArtists"
import { DarkModeSettings } from "app/Scenes/MyProfile/DarkModeSettings"
import { MyProfile } from "app/Scenes/MyProfile/MyProfile"
import { MyProfileEditFormScreen } from "app/Scenes/MyProfile/MyProfileEditForm"
import { MyProfilePaymentQueryRenderer } from "app/Scenes/MyProfile/MyProfilePayment"
import { MyProfilePaymentNewCreditCard } from "app/Scenes/MyProfile/MyProfilePaymentNewCreditCard"
import { MyProfilePushNotificationsQueryRenderer } from "app/Scenes/MyProfile/MyProfilePushNotifications"
import { MyProfileSettings } from "app/Scenes/MyProfile/MyProfileSettings"
import { NewWorksForYouQueryRenderer } from "app/Scenes/NewWorksForYou/NewWorksForYou"
import { NewWorksFromGalleriesYouFollowScreen } from "app/Scenes/NewWorksFromGalleriesYouFollow/NewWorksFromGalleriesYouFollow"
import { OrderDetailsQueryRender } from "app/Scenes/OrderHistory/OrderDetails/Components/OrderDetails"
import { OrderHistoryQueryRender } from "app/Scenes/OrderHistory/OrderHistory"
import { PartnerQueryRenderer } from "app/Scenes/Partner/Partner"
import { PartnerLocationsQueryRenderer } from "app/Scenes/Partner/Screens/PartnerLocations"
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
import { EditSavedSearchAlertQueryRenderer } from "app/Scenes/SavedSearchAlert/EditSavedSearchAlert"
import { SavedSearchAlertsListQueryRenderer } from "app/Scenes/SavedSearchAlertsList/SavedSearchAlertsList"
import { SearchScreen, SearchScreenQuery } from "app/Scenes/Search/Search"
import { SubmitArtworkForm } from "app/Scenes/SellWithArtsy/ArtworkForm/SubmitArtworkForm"
import { SubmitArtworkFormEditContainer } from "app/Scenes/SellWithArtsy/ArtworkForm/SubmitArtworkFormEdit"
import { ConsignmentInquiryScreen } from "app/Scenes/SellWithArtsy/ConsignmentInquiry/ConsignmentInquiryScreen"
import { SellWithArtsyHomeScreenQuery } from "app/Scenes/SellWithArtsy/SellWithArtsyHome"
import { SellWithArtsy } from "app/Scenes/SellWithArtsy/SubmitArtwork/UploadPhotos/utils"
import { ShowMoreInfoQueryRenderer } from "app/Scenes/Show/Screens/ShowMoreInfo"
import { ShowQueryRenderer } from "app/Scenes/Show/Show"
import { SimilarToRecentlyViewedScreen } from "app/Scenes/SimilarToRecentlyViewed/SimilarToRecentlyViewed"
import { TagQueryRenderer } from "app/Scenes/Tag/Tag"
import { VanityURLEntityRenderer } from "app/Scenes/VanityURL/VanityURLEntity"
import {
  ViewingRoomQueryRenderer,
  ViewingRoomScreenQuery,
} from "app/Scenes/ViewingRoom/ViewingRoom"
import { ViewingRoomArtworkScreen } from "app/Scenes/ViewingRoom/ViewingRoomArtwork"
import { ViewingRoomArtworksQueryRenderer } from "app/Scenes/ViewingRoom/ViewingRoomArtworks"
import {
  ViewingRoomsListScreen,
  viewingRoomsListScreenQuery,
} from "app/Scenes/ViewingRoom/ViewingRoomsList"
import { unsafe__getEnvironment } from "app/store/GlobalStore"
import { DevMenu } from "app/system/devTools/DevMenu/DevMenu"
import { goBack } from "app/system/navigation/navigate"
import { replaceParams } from "app/system/navigation/utils/replaceParams"
import { compact } from "lodash"
import React from "react"
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
  Queries?: GraphQLTaggedNode[]
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
    Queries: [homeViewScreenQuery],
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
    Queries: [activityHeaderQuery, activityContentQuery],
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
    Queries: [ActivityItemQuery],
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
    Queries: [ArticlesScreenQuery],
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
  },
  {
    path: "/artist/:artistID",
    name: "Artist",
    Component: ArtistQueryRenderer,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
    Queries: [ArtistScreenQuery],
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
  },
  {
    path: "/artist/:artistID/auction-result/:auctionResultInternalID",
    name: "AuctionResult",
    Component: AuctionResultQueryRenderer,
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
    Queries: [ArtistScreenQuery],

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
    Queries: [ArtistScreenQuery],
    injectParams: (params) => ({
      ...params,
      initialTab: "Artworks",
      scrollToArtworksGrid: true,
    }),
  },
  {
    path: "/artist/:artistID/shows",
    name: "ArtistShows",
    Component: ArtistShows2QueryRenderer,
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
    Queries: [ArtistScreenQuery],
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
    Queries: [ArtistScreenQuery],
  }, // For artists in a gallery context, like https://www.artsy.net/spruth-magers/artist/astrid-klein . Until we have a native // version of the gallery profile/context, we will use the normal native artist view instead of showing a web view.

  {
    path: "/artwork-certificate-of-authenticity",
    name: "ArtworkCertificateAuthenticity",
    Component: CertificateOfAuthenticity,
  },
  {
    path: "/artwork-classifications",
    name: "ArtworkAttributionClassFAQ",
    Component: ArtworkAttributionClassFAQQueryRenderer,
  },
  {
    path: "/artwork-lists",
    name: "SavedArtworks",
    Component: SavedArtworks,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
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
      screenOptions: {
        headerShown: false,
      },
    },
    Queries: [ArtworkScreenQuery],
  },
  {
    path: "/artwork/:artworkID/medium",
    name: "ArtworkMedium",
    Component: ArtworkMediumQueryRenderer,
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
    Queries: [AuctionResultsForArtistsYouFollowPrefetchQuery],
  },
  {
    path: "/auction/:saleID",
    name: "Auction",
    Component: SaleQueryRenderer,
    options: { screenOptions: { headerShown: false } },
    Queries: [SaleScreenQuery],
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
    Queries: [SalesScreenQuery],
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
  },
  {
    path: "/city-save/:citySlug",
    name: "CitySavedList",
    Component: CitySavedListQueryRenderer,
  },
  {
    path: "/city/:citySlug/:section",
    name: "CitySectionList",
    Component: CitySectionListQueryRenderer,
  },
  {
    path: "/collections-by-category/:category",
    name: "CollectionsByCategory",
    Component: CollectionsByCategory,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
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
  },
  {
    path: "/collection/:collectionID/artists",
    name: "FullFeaturedArtistList",
    Component: CollectionFullFeaturedArtistListQueryRenderer,
    options: {
      screenOptions: {
        headerTitle: "Featured Artists",
      },
    },
  },
  {
    path: "/collections/my-collection/marketing-landing",
    name: "SellNotRootTabView",
    Component: SellWithArtsy,
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
    Queries: [FairScreenQuery],
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
    Queries: [FairScreenQuery],
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
    Queries: [FairScreenQuery],
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
    Queries: [FairScreenQuery],
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
  },
  {
    path: "/favorites",
    name: "Favorites",
    Component: Favorites,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
  },
  {
    path: "/feature/:slug",
    name: "Feature",
    Component: FeatureQueryRenderer,
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
  },
  {
    path: "/home-view/sections/:sectionID",
    name: "HomeViewSectionScreen",
    Component: HomeViewSectionScreenQueryRenderer,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
  },
  {
    path: "/inbox",
    name: "Inbox",
    Component: InboxQueryRenderer,
    options: {
      isRootViewForTabName: "inbox",
      onlyShowInTabName: "inbox",
      screenOptions: {
        headerShown: false,
      },
    },
    Queries: [InboxScreenQuery],
  },
  {
    path: "/infinite-discovery",
    name: "InfiniteDiscovery",
    Component: InfiniteDiscoveryQueryRenderer,
    options: {
      hidesBottomTabs: true,
      screenOptions: {
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
    Component: CityGuideView,
    options: {
      screenOptions: {
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
  },
  {
    path: "/my-account",
    name: "MyAccount",
    Component: MyAccountQueryRenderer,
    options: {
      screenOptions: {
        headerTitle: "Account Settings",
      },
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
        headerTitle: "Phone Number",
      },
    },
  },
  {
    path: "/my-account/edit-price-range",
    name: "MyAccountEditPriceRange",
    Component: MyAccountEditPriceRangeQueryRenderer,
    options: {
      screenOptions: {
        headerTitle: "Price Range",
      },
    },
  },
  {
    path: "/my-collection",
    name: "MyCollection",
    Component: MyCollectionQueryRenderer,
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
    Queries: [MyCollectionArtworkScreenQuery],
  },
  {
    path: "/my-collection/artwork/:artworkID/price-estimate",
    name: "RequestForPriceEstimateScreen",
    Component: RequestForPriceEstimateScreen,
  },
  {
    path: "/my-collection/artwork/:artworkID/price-estimate/success",
    name: "RequestForPriceEstimateConfirmationScreen",
    Component: RequestForPriceEstimateConfirmationScreen,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
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
    Component: MyProfile,
    options: {
      isRootViewForTabName: "profile",
      onlyShowInTabName: "profile",
      screenOptions: {
        headerShown: false,
      },
    },
    Queries: [MyCollectionScreenQuery],
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
  },
  {
    path: "/my-profile/payment",
    name: "MyProfilePayment",
    Component: MyProfilePaymentQueryRenderer,
    options: {
      screenOptions: {
        headerTitle: "Payment",
      },
    },
  },
  {
    path: "/my-profile/payment/new-card",
    name: "MyProfilePaymentNewCreditCard",
    Component: MyProfilePaymentNewCreditCard,
    options: {
      screenOptions: {
        headerTitle: "Add new card",
      },
    },
  },
  {
    path: "/my-profile/push-notifications",
    name: "MyProfilePushNotifications",
    Component: MyProfilePushNotificationsQueryRenderer,
    options: {
      screenOptions: {
        headerTitle: "Push Notifications",
      },
    },
  },
  {
    path: "/my-profile/settings",
    name: "MyProfileSettings",
    Component: MyProfileSettings,
    options: {
      screenOptions: {
        headerTitle: "Account",
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
    Queries: [NewsScreenQuery],
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
  },
  {
    path: "/partner/:partnerID/artists/:artistID",
    name: "Partner",
    Component: PartnerQueryRenderer,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
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
    Queries: [RecentlyViewedScreenQuery],
  },
  {
    path: "/sell",
    name: "Sell",
    Component: SellWithArtsy,
    options: {
      isRootViewForTabName: "sell",
      onlyShowInTabName: "sell",
      screenOptions: {
        headerShown: false,
      },
    },
    Queries: [SellWithArtsyHomeScreenQuery],
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
    Queries: [SearchScreenQuery],
  },
  {
    path: "/sell/inquiry",
    name: "ConsignmentInquiry",
    Component: ConsignmentInquiryScreen,
    options: {
      screenOptions: {
        gestureEnabled: false,
      },
    },
  },
  {
    path: "/sell/submissions/new",
    name: "SubmitArtwork",
    Component: SubmitArtworkForm,
    options: {
      alwaysPresentModally: true,
      screenOptions: {
        gestureEnabled: false,
        headerShown: false,
      },
    },
  },
  {
    path: "/sell/submissions/:externalID/edit",
    name: "SubmitArtworkEdit",
    Component: SubmitArtworkFormEditContainer,
    options: {
      alwaysPresentModally: true,
      hidesBottomTabs: true,
      screenOptions: {
        gestureEnabled: false,
        headerShown: false,
      },
    },
  },
  {
    path: "/selling-with-artsy",
    name: "MyCollectionSellingWithartsyFAQ",
    Component: MyCollectionSellingWithArtsyFAQ,
  },
  {
    path: "/favorites/alerts",
    name: "SavedSearchAlertsList",
    Component: SavedSearchAlertsListQueryRenderer,
    options: {
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
    path: "/favorites/saves",
    name: "SavedArtworks",
    Component: SavedArtworks,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
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
    path: "/settings/dark-mode",
    name: "DarkModeSettings",
    Component: DarkModeSettings,
  },
  {
    path: "/show/:showID",
    name: "Show",
    Component: ShowQueryRenderer,
  },
  {
    path: "/show/:showID/info",
    name: "ShowMoreInfo",
    Component: ShowMoreInfoQueryRenderer,
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
  },
  {
    path: "/user/purchases/:orderID",
    name: "OrderDetails",
    Component: OrderDetailsQueryRender,
    options: {
      screenOptions: {
        headerTitle: "Order Details",
      },
    },
  },
  {
    path: "/viewing-room/:viewing_room_id",
    name: "ViewingRoom",
    Component: ViewingRoomQueryRenderer,
    Queries: [ViewingRoomScreenQuery],
  },
  {
    path: "/viewing-room/:viewing_room_id/artworks",
    name: "ViewingRoomArtworks",
    Component: ViewingRoomArtworksQueryRenderer,
  },
  {
    path: "/viewing-room/:viewing_room_id/:artwork_id",
    name: "ViewingRoomArtwork",
    Component: ViewingRoomArtworkScreen,
  },
  {
    path: "/viewing-rooms",
    name: "ViewingRooms",
    Component: ViewingRoomsListScreen,
    Queries: [viewingRoomsListScreenQuery],
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
    Queries: [WorksForYouScreenQuery],
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
  webViewRoute({ path: "/unsubscribe" }),

  // Every other route needs to go above
  {
    path: "/:slug",
    name: "VanityURLEntity",
    Component: VanityURLEntityRenderer,
  },
  webViewRoute({ path: "/*" }),
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
