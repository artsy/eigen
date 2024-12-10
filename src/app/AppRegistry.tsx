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
import { HomeViewScreen, homeViewScreenQuery } from "app/Scenes/HomeView/HomeView"
import { HomeViewSectionScreenQueryRenderer } from "app/Scenes/HomeViewSectionScreen/HomeViewSectionScreen"
import { ConversationQueryRenderer } from "app/Scenes/Inbox/Screens/Conversation"
import { InfiniteDiscoveryView } from "app/Scenes/InfiniteDiscovery/InfiniteDiscovery"
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
import React from "react"
import { View } from "react-native"
import { GraphQLTaggedNode } from "react-relay"
import { ArtsyWebViewPage } from "./Components/ArtsyWebView"
import { CityGuideView } from "./NativeModules/CityGuideView"
import { LiveAuctionView } from "./NativeModules/LiveAuctionView"
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
import { BottomTabType } from "./Scenes/BottomTabs/BottomTabType"
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
import { DevMenu } from "./system/devTools/DevMenu/DevMenu"

export interface ViewOptions {
  alwaysPresentModally?: boolean
  // @deprecated Use screenOptions.headerShown instead
  hidesBottomTabs?: boolean
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

export type AppModule = keyof typeof modules

export const modules = defineModules({
  Activity: reactModule({
    Component: ActivityScreen,
    options: {
      hidesBottomTabs: true,
      screenOptions: {
        headerShown: false,
      },
    },
  }),
  ActivityItem: reactModule({
    Component: ActivityItemScreenQueryRenderer,
    options: {
      hidesBottomTabs: true,
      screenOptions: {
        headerShown: false,
      },
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
      screenOptions: {
        headerShown: false,
      },
    },
  }),
  AlertArtworks: reactModule({
    Component: AlertArtworks,
    options: {
      hidesBottomTabs: true,
      screenOptions: {
        headerShown: false,
      },
    },
  }),
  ArtQuiz: reactModule({
    Component: ArtQuiz,
    options: {
      screenOptions: {
        gestureEnabled: false,
      },
      hidesBottomTabs: true,
    },
  }),
  ArtQuizResults: reactModule({
    Component: ArtQuizResults,
    options: {
      screenOptions: {
        animationTypeForReplace: "pop",
        headerShown: false,
      },
    },
  }),
  Article: reactModule({
    Component: ArticleScreen,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
  }),
  ArticleSlideShow: reactModule({
    Component: ArticlesSlideShowScreen,
    options: {
      hidesBottomTabs: true,
      screenOptions: {
        headerShown: false,
      },
    },
  }),
  Articles: reactModule({
    Component: ArticlesScreen,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
    Queries: [ArticlesScreenQuery],
  }),
  Artist: reactModule({
    Component: ArtistQueryRenderer,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
    Queries: [ArtistScreenQuery],
  }),
  ArtistShows: reactModule({ Component: ArtistShows2QueryRenderer }),
  ArtistArticles: reactModule({
    Component: ArtistArticlesQueryRenderer,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
  }),
  ArtistSeries: reactModule({
    Component: ArtistSeriesQueryRenderer,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
  }),
  Artwork: reactModule({
    Component: ArtworkScreen,
    options: {
      hidesBottomTabs: true,
      screenOptions: {
        headerShown: false,
      },
    },
    Queries: [ArtworkScreenQuery],
  }),
  ArtworkMedium: reactModule({
    Component: ArtworkMediumQueryRenderer,
  }),
  ArtworkAttributionClassFAQ: reactModule({
    Component: ArtworkAttributionClassFAQQueryRenderer,
  }),
  ArtworkCertificateAuthenticity: reactModule({
    Component: CertificateOfAuthenticity,
  }),
  ArtworkList: reactModule({
    Component: ArtworkListScreen,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
  }),
  ArtworkRecommendations: reactModule({
    Component: ArtworkRecommendationsScreen,
    options: {
      screenOptions: {
        headerTitle: "Artwork Recommendations",
      },
    },
  }),
  Auction: reactModule({
    Component: SaleQueryRenderer,
    options: { screenOptions: { headerShown: false } },
    Queries: [SaleScreenQuery],
  }),
  Auctions: reactModule({
    Component: SalesScreen,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
    Queries: [SalesScreenQuery],
  }),
  AuctionInfo: reactModule({ Component: SaleInfoQueryRenderer }),
  AuctionResult: reactModule({
    Component: AuctionResultQueryRenderer,
  }),
  AuctionResultsForArtistsYouFollow: reactModule({
    Component: AuctionResultsForArtistsYouFollowQueryRenderer,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
    Queries: [AuctionResultsForArtistsYouFollowPrefetchQuery],
  }),
  AuctionResultsForArtistsYouCollect: reactModule({
    Component: AuctionResultsForArtistsYouCollect,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
  }),
  AuctionRegistration: reactModule({
    Component: RegistrationFlow,
    options: {
      alwaysPresentModally: true,
      screenOptions: {
        // Don't allow the screen to be swiped away by mistake
        gestureEnabled: false,
        headerShown: false,
      },
    },
  }),
  AuctionBidArtwork: reactModule({
    Component: BidFlow,
    options: {
      alwaysPresentModally: true,
      screenOptions: {
        headerShown: false,
      },
    },
  }),
  AuctionBuyersPremium: reactModule({
    Component: AuctionBuyersPremiumQueryRenderer,
  }),
  BrowseSimilarWorks: reactModule({
    Component: BrowseSimilarWorksQueryRenderer,
    options: {
      hidesBottomTabs: true,
      screenOptions: {
        headerShown: false,
      },
    },
  }),
  CareerHighlightsBigCardsSwiper: reactModule({
    Component: CareerHighlightsBigCardsSwiper,
    options: {
      hidesBottomTabs: true,
      screenOptions: {
        headerShown: false,
      },
    },
  }),
  City: reactModule({ Component: CityView }),
  CityFairList: reactModule({ Component: CityFairListQueryRenderer }),
  CityPicker: reactModule({
    Component: CityPicker,
  }),
  CitySavedList: reactModule({ Component: CitySavedListQueryRenderer }),
  CitySectionList: reactModule({ Component: CitySectionListQueryRenderer }),
  Collection: reactModule({
    Component: CollectionScreen,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
  }),
  CollectionsByCategory: reactModule({
    Component: CollectionsByCategory,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
  }),
  ConsignmentInquiry: reactModule({
    Component: ConsignmentInquiryScreen,
    options: {
      screenOptions: {
        gestureEnabled: false,
      },
    },
  }),
  Conversation: reactModule({
    Component: ConversationQueryRenderer,
    options: {
      onlyShowInTabName: "inbox",
      screenOptions: {
        headerShown: false,
      },
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
      alwaysPresentModally: true,
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
      hidesBottomTabs: true,
      screenOptions: {
        headerShown: false,
      },
    },
  }),
  Fair: reactModule({
    Component: FairScreen,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
    Queries: [FairScreenQuery],
  }),
  FairMoreInfo: reactModule({
    Component: FairMoreInfoQueryRenderer,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
  }),
  FairArticles: reactModule({
    Component: FairArticlesQueryRenderer,
    options: {
      screenOptions: {
        headerTitle: "Articles",
      },
    },
  }),
  FairAllFollowedArtists: reactModule({
    Component: FairAllFollowedArtistsQueryRenderer,
    options: {
      screenOptions: {
        headerTitle: "Artworks",
      },
    },
  }),
  Favorites: reactModule({
    Component: Favorites,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
  }),
  Feature: reactModule({ Component: FeatureQueryRenderer }),
  FullArtistSeriesList: reactModule({
    Component: ArtistSeriesFullArtistSeriesListQueryRenderer,
    options: {
      screenOptions: {
        headerTitle: "Artist Series",
      },
    },
  }),
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
      screenOptions: {
        headerShown: false,
      },
    },
  }),
  Gene: reactModule({
    Component: GeneQueryRenderer,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
  }),
  Home: reactModule({
    Component: HomeViewScreen,
    options: {
      isRootViewForTabName: "home",
      onlyShowInTabName: "home",
      screenOptions: {
        headerShown: false,
      },
    },
    Queries: [homeViewScreenQuery],
  }),
  HomeViewSectionScreen: reactModule({
    Component: HomeViewSectionScreenQueryRenderer,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
  }),
  Inbox: reactModule({
    Component: InboxQueryRenderer,
    options: {
      isRootViewForTabName: "inbox",
      onlyShowInTabName: "inbox",
      screenOptions: {
        headerShown: false,
      },
    },
    Queries: [InboxScreenQuery],
  }),
  InfiniteDiscovery: reactModule({
    Component: InfiniteDiscoveryView,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
  }),
  Inquiry: reactModule({
    Component: InquiryQueryRenderer,
    options: {
      alwaysPresentModally: true,
      screenOptions: {
        headerShown: false,
      },
    },
  }),
  LiveAuction: reactModule({
    Component: LiveAuctionView,
    options: {
      alwaysPresentModally: true,
      screenOptions: {
        headerShown: false,
      },
    },
  }),
  LocalDiscovery: reactModule({
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
  }),
  MakeOfferModal: reactModule({
    Component: MakeOfferModalQueryRenderer,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
  }),
  MedianSalePriceAtAuction: reactModule({ Component: MedianSalePriceAtAuction }),
  Map: reactModule({ Component: MapContainer }),
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
      screenOptions: {
        headerTitle: "Email",
      },
    },
  }),
  MyAccountEditPriceRange: reactModule({
    Component: MyAccountEditPriceRangeQueryRenderer,
    options: {
      screenOptions: {
        headerTitle: "Price Range",
      },
    },
  }),
  MyAccountEditPassword: reactModule({
    Component: MyAccountEditPassword,
    options: {
      screenOptions: {
        headerTitle: "Password",
      },
    },
  }),
  MyAccountEditPhone: reactModule({
    Component: MyAccountEditPhoneQueryRenderer,
    options: {
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
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
    Queries: [MyCollectionArtworkScreenQuery],
  }),
  MyCollectionArtworkAdd: reactModule({
    Component: MyCollectionArtworkAdd,
    options: {
      alwaysPresentModally: true,
      screenOptions: {
        gestureEnabled: false,
        headerShown: false,
      },
    },
  }),
  MyCollectionArtworkEdit: reactModule({
    Component: MyCollectionArtworkEditQueryRenderer,
    options: {
      alwaysPresentModally: true,
      screenOptions: {
        gestureEnabled: false,
        headerShown: false,
      },
    },
  }),
  MyCollectionAddCollectedArtists: reactModule({
    Component: MyCollectionAddCollectedArtistsScreen,
    options: {
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
      hidesBottomTabs: true,
      screenOptions: {
        gestureEnabled: false,
        headerShown: false,
      },
    },
  }),
  MyProfile: reactModule({
    Component: MyProfile,
    options: {
      isRootViewForTabName: "profile",
      onlyShowInTabName: "profile",
      screenOptions: {
        headerShown: false,
      },
    },
    Queries: [MyCollectionScreenQuery],
  }),
  CompleteMyProfile: reactModule({
    Component: CompleteMyProfile,
    options: {
      hidesBottomTabs: true,
      screenOptions: {
        headerShown: false,
      },
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
      screenOptions: {
        headerShown: false,
      },
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
      screenOptions: {
        headerShown: false,
      },
    },
  }),
  News: reactModule({
    Component: NewsScreen,
    options: {
      screenOptions: {
        headerShown: false,
      },
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
      screenOptions: {
        headerShown: false,
      },
    },
  }),
  PartnerLocations: reactModule({ Component: PartnerLocationsQueryRenderer }),
  PartnerOfferContainer: reactModule({
    Component: PartnerOfferContainer,
    options: {
      hidesBottomTabs: true,
      screenOptions: {
        headerShown: false,
      },
    },
  }),
  PriceDatabase: reactModule({
    Component: PriceDatabase,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
  }),
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
      screenOptions: {
        headerShown: false,
      },
    },
  }),
  ModalWebView: reactModule({
    Component: ArtsyWebViewPage,
    options: {
      alwaysPresentModally: true,
      screenOptions: {
        gestureEnabled: false,
        headerShown: false,
      },
    },
  }),
  ReactWebView: reactModule({
    Component: ArtsyWebViewPage,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
  }),
  RequestForPriceEstimateScreen: reactModule({ Component: RequestForPriceEstimateScreen }),
  RequestForPriceEstimateConfirmationScreen: reactModule({
    Component: RequestForPriceEstimateConfirmationScreen,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
  }),
  RecentlyViewed: reactModule({
    Component: RecentlyViewedScreen,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
    Queries: [RecentlyViewedScreenQuery],
  }),
  RecommendedAuctionLots: reactModule({
    Component: RecommendedAuctionLotsQueryRenderer,
    options: {
      hidesBottomTabs: true,
      screenOptions: {
        headerShown: false,
      },
    },
  }),
  Sell: reactModule({
    Component: SellWithArtsy,
    options: {
      isRootViewForTabName: "sell",
      onlyShowInTabName: "sell",
      screenOptions: {
        headerShown: false,
      },
    },
    Queries: [SellWithArtsyHomeScreenQuery],
  }),
  SellNotRootTabView: reactModule({ Component: SellWithArtsy }),
  SavedArtworks: reactModule({
    Component: SavedArtworks,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
  }),
  SavedSearchAlertsList: reactModule({
    Component: SavedSearchAlertsListQueryRenderer,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
  }),
  Search: reactModule({
    Component: SearchScreen,
    options: {
      isRootViewForTabName: "search",
      onlyShowInTabName: "search",
      screenOptions: {
        headerShown: false,
      },
    },
    Queries: [SearchScreenQuery],
  }),
  Show: reactModule({ Component: ShowQueryRenderer }),
  ShowMoreInfo: reactModule({ Component: ShowMoreInfoQueryRenderer }),
  SimilarToRecentlyViewed: reactModule({
    Component: SimilarToRecentlyViewedScreen,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
  }),
  SubmitArtwork: reactModule({
    Component: SubmitArtworkForm,
    options: {
      alwaysPresentModally: true,
      screenOptions: {
        gestureEnabled: false,
        headerShown: false,
      },
    },
  }),
  SubmitArtworkEdit: reactModule({
    Component: SubmitArtworkFormEditContainer,
    options: {
      alwaysPresentModally: true,
      hidesBottomTabs: true,
      screenOptions: {
        gestureEnabled: false,
        headerShown: false,
      },
    },
  }),
  Tag: reactModule({
    Component: TagQueryRenderer,
    options: {
      screenOptions: {
        headerShown: false,
      },
    },
  }),
  UnlistedArtworksFAQScreen: reactModule({
    Component: UnlistedArtworksFAQScreen,
    options: {
      screenOptions: {
        headerTitle: "Private Listings",
      },
    },
  }),
  VanityURLEntity: reactModule({
    Component: VanityURLEntityRenderer,
  }),
  ViewingRoom: reactModule({
    Component: ViewingRoomQueryRenderer,
    Queries: [ViewingRoomScreenQuery],
  }),
  ViewingRoomArtwork: reactModule({ Component: ViewingRoomArtworkScreen }),
  ViewingRoomArtworks: reactModule({ Component: ViewingRoomArtworksQueryRenderer }),
  ViewingRooms: reactModule({
    Component: ViewingRoomsListScreen,
    Queries: [viewingRoomsListScreenQuery],
    options: {
      screenOptions: {
        headerTitle: "Viewing Rooms",
      },
    },
  }),
  WorksForYou: reactModule({
    Component: WorksForYouQueryRenderer,
    Queries: [WorksForYouScreenQuery],
  }),
})

export const nonTabModules = Object.fromEntries(
  Object.entries(modules).filter(([_, module]) => {
    return (
      // The module should not be a root view for a tab
      !module.options.isRootViewForTabName &&
      // The module is not an restricted to a specific tab
      !module.options.onlyShowInTabName
    )
  })
)
