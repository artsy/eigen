import { parse } from "url"
import { unsafe__getEnvironment } from "app/store/GlobalStore"
import { RouteMatcher } from "app/system/navigation/RouteMatcher"
import { addRoute, addWebViewRoute } from "app/system/router/utils"
import { compact } from "lodash"
import { Platform } from "react-native"

export function getDomainMap(): Record<string, RouteMatcher[] | null> {
  const liveDotArtsyDotNet: RouteMatcher[] = compact([
    Platform.OS === "ios"
      ? addRoute("/*", "LiveAuction", (params) => ({ slug: params["*"] }))
      : addRoute("/*", "ReactWebView", (params) => ({
          url: unsafe__getEnvironment().predictionURL + "/" + params["*"],
        })),
  ])

  const artsyDotNet: RouteMatcher[] = compact([
    addRoute("/", "Home"),
    addRoute("/about", "About"),
    addRoute("/notifications", "Activity"),
    addRoute("/notification/:notificationID", "ActivityItem"),
    addRoute("/art-quiz", "ArtQuiz"),
    addRoute("/art-quiz/artworks", "ArtQuiz"),
    addRoute("/art-quiz/results", "ArtQuizResults"),
    addRoute("/article/:articleID", "Article"),
    addRoute("/article/:articleID/slideshow", "ArticleSlideShow"),
    addRoute("/articles", "Articles"),
    addRoute("/artist-series/:artistSeriesID", "ArtistSeries"),
    addRoute("/artist/:artistID", "Artist"),
    addRoute("/artist/:artistID/articles", "ArtistArticles"),
    addRoute("/artist/:artistID/artist-series", "FullArtistSeriesList"),
    addRoute("/artist/:artistID/auction-result/:auctionResultInternalID", "AuctionResult"),
    addRoute("/artist/:artistID/auction-results", "Artist", (params) => ({
      ...params,
      initialTab: "Insights",
    })),
    addRoute("/artist/:artistID/artworks", "Artist", (params) => ({
      ...params,
      initialTab: "Artworks",
      scrollToArtworksGrid: true,
    })),
    addRoute("/artist/:artistID/shows", "ArtistShows"),

    // Routes `/artist/:artistID/*` and `"/:profile_id_ignored/artist/:artistID"`
    // MUST go together The following two
    addRoute("/artist/:artistID/*", "Artist"),
    addRoute("/:profile_id_ignored/artist/:artistID", "Artist"), // For artists in a gallery context, like https://www.artsy.net/spruth-magers/artist/astrid-klein . Until we have a native // version of the gallery profile/context, we will use the normal native artist view instead of showing a web view.

    addRoute("/artwork-certificate-of-authenticity", "ArtworkCertificateAuthenticity"),
    addRoute("/artwork-classifications", "ArtworkAttributionClassFAQ"),
    addRoute("/artwork-lists", "MyProfile", (params) => ({
      ...params,
      initialTab: "Saves",
    })),
    addRoute("/artwork-list/:listID", "ArtworkList"),
    addRoute("/artwork-recommendations", "ArtworkRecommendations"),
    addRoute("/artwork/:artworkID", "Artwork"),
    addRoute("/artwork/:artworkID/medium", "ArtworkMedium"),
    addRoute("/artwork/:artworkID/browse-similar-works", "BrowseSimilarWorks"),
    addRoute("/auction-registration/:saleID", "AuctionRegistration"),
    addRoute("/auction-results-for-artists-you-collect", "AuctionResultsForArtistsYouCollect"),
    addRoute("/auction-results-for-artists-you-follow", "AuctionResultsForArtistsYouFollow"),
    addRoute("/auction/:saleID", "Auction"),
    addRoute("/auction/:saleID/bid/:artworkID", "AuctionBidArtwork"),
    addRoute("/auction/:saleID/buyers-premium", "AuctionBuyersPremium"),
    addRoute("/auction/:saleID/info", "AuctionInfo"),
    addRoute("/auctions", "Auctions"),
    addRoute("/auctions/lots-for-you-ending-soon", "RecommendedAuctionLots"),
    addRoute("/city-fair/:citySlug", "CityFairList"),
    addRoute("/city-save/:citySlug", "CitySavedList"),
    addRoute("/city/:citySlug/:section", "CitySectionList"),
    addRoute("/collection/:collectionID", "Collection"),
    addRoute("/collection/:collectionID/artists", "FullFeaturedArtistList"),
    addRoute("/collections/my-collection/marketing-landing", "SellNotRootTabView"),
    addRoute("/conversation/:conversationID", "Conversation"),
    addRoute("/conversation/:conversationID/details", "ConversationDetails"),
    addRoute("/dev-menu", "DevMenu"),
    addRoute("/fair/:fairID", "Fair"),
    addRoute("/fair/:fairID/articles", "FairArticles"),
    addRoute("/fair/:fairID/artists", "Fair"),
    addRoute("/fair/:fairID/artworks", "Fair"),
    addRoute("/fair/:fairID/exhibitors", "Fair"),
    addRoute("/fair/:fairID/followedArtists", "FairAllFollowedArtists"),
    addRoute("/fair/:fairID/info", "FairMoreInfo"),
    addRoute("/favorites", "Favorites"),
    addRoute("/feature/:slug", "Feature"),
    addRoute("/galleries-for-you", "GalleriesForYou"),
    addRoute("/gene/:geneID", "Gene"),
    addRoute("/home-view", "HomeView"),
    addRoute("/home-view/sections/:sectionID", "HomeViewSectionScreen"),
    addRoute("/inbox", "Inbox"),
    addRoute("/inquiry/:artworkID", "Inquiry"),
    addRoute("/local-discovery", "LocalDiscovery"),
    addRoute("/make-offer/:artworkID", "MakeOfferModal"),
    addRoute("/my-account", "MyAccount"),
    addRoute("/my-account", "MyAccount"),
    addRoute("/my-account/delete-account", "MyAccountDeleteAccount"),
    addRoute("/my-account/edit-email", "MyAccountEditEmail"),
    addRoute("/my-account/edit-password", "MyAccountEditPassword"),
    addRoute("/my-account/edit-phone", "MyAccountEditPhone"),
    addRoute("/my-account/edit-price-range", "MyAccountEditPriceRange"),
    addRoute("/my-collection", "MyCollection"),
    addRoute("/my-collection/artists/new", "AddMyCollectionArtist"),
    addRoute("/my-collection/artwork/:artworkId", "MyCollectionArtwork"),
    addRoute("/my-collection/artwork/:artworkID/price-estimate", "RequestForPriceEstimateScreen"),
    addRoute(
      "/my-collection/artwork/:artworkID/price-estimate/success",
      "RequestForPriceEstimateConfirmationScreen"
    ),
    addRoute("/my-collection/artworks/:artworkID/edit", "MyCollectionArtworkEdit"),
    addRoute("/my-collection/artworks/new", "MyCollectionArtworkAdd"),
    addRoute("/my-collection/collected-artists/new", "MyCollectionAddCollectedArtists"),
    addRoute("/my-collection/career-highlights", "CareerHighlightsBigCardsSwiper"),
    addRoute("/my-collection/median-sale-price-at-auction/:artistID", "MedianSalePriceAtAuction"),
    addRoute(
      "/my-collection/collected-artists/privacy-settings",
      "MyCollectionCollectedArtistsPrivacy"
    ),
    addRoute("/complete-my-profile", "CompleteMyProfile"),
    addRoute("/my-profile", "MyProfile"),
    addRoute("/my-profile/edit", "MyProfileEditForm"),
    addRoute("/my-profile/payment", "MyProfilePayment"),
    addRoute("/my-profile/payment/new-card", "MyProfilePaymentNewCreditCard"),
    addRoute("/my-profile/push-notifications", "MyProfilePushNotifications"),
    addRoute("/my-profile/settings", "MyProfileSettings"),
    addRoute("/news", "News"),
    addRoute("/new-for-you", "NewWorksForYou"),
    addRoute("/new-works-from-galleries-you-follow", "NewWorksFromGalleriesYouFollow"),
    addRoute("/orders", "OrderHistory"),
    addRoute("/partner-locations/:partnerID", "PartnerLocations"),
    addRoute("/partner-offer/:partnerOfferID/checkout", "PartnerOfferContainer"),
    addRoute("/partner/:partnerID", "Partner"),
    addRoute("/partner/:partnerID/artists/:artistID", "Partner"),
    addRoute("/partner/:partnerID/shows", "Partner", (params) => ({
      ...params,
      initialTab: "Shows",
    })),
    addRoute("/partner/:partnerID/works", "Partner", (params) => ({
      ...params,
      initialTab: "Artworks",
    })),
    addRoute("/price-database", "PriceDatabase"),
    addRoute("/privacy-request", "PrivacyRequest"),
    addRoute("/purchase/:artworkID", "PurchaseModal"),
    addRoute("/recently-viewed", "RecentlyViewed"),
    addRoute("/sell", "Sell"),
    addRoute("/search", "Search"),
    addRoute("/sell/inquiry", "ConsignmentInquiry"),
    addRoute("/sell/submissions/new", "SubmitArtwork"),
    addRoute("/sell/submissions/:externalID/edit", "SubmitArtworkEdit"),
    addRoute("/selling-with-artsy", "MyCollectionSellingWithartsyFAQ"),
    addRoute("/settings/alerts", "SavedSearchAlertsList"),
    addRoute("/settings/alerts/:savedSearchAlertId/edit", "EditSavedSearchAlert"),
    addRoute("/settings/alerts/:alertId/artworks", "AlertArtworks"),
    addRoute("/settings/saves", "SavedArtworks"),
    addRoute("/settings/saves/:listID", "ArtworkList"),
    addRoute("/settings/dark-mode", "DarkModeSettings"),
    addRoute("/show/:showID", "Show"),
    addRoute("/show/:showID/info", "ShowMoreInfo"),
    addRoute("/similar-to-recently-viewed", "SimilarToRecentlyViewed"),
    addRoute("/tag/:tagID", "Tag"),
    addRoute("/unlisted-artworks-faq", "UnlistedArtworksFAQScreen"),
    addRoute("/user/conversations/:conversationID", "Conversation"),
    addRoute("/user/purchases/:orderID", "OrderDetails"),
    addRoute("/viewing-room/:viewing_room_id", "ViewingRoom"),
    addRoute("/viewing-room/:viewing_room_id/artworks", "ViewingRoomArtworks"),
    addRoute("/viewing-room/:viewing_room_id/:artwork_id", "ViewingRoomArtwork"),
    addRoute("/viewing-rooms", "ViewingRooms"),
    addRoute("/works-for-you", "WorksForYou"),

    // Webview routes
    addWebViewRoute("/auction-faq", {
      alwaysPresentModally: true,
      safeAreaEdges: ["bottom"],
    }),
    addWebViewRoute("/buy-now-feature-faq"),
    addWebViewRoute("/buyer-guarantee"),
    addWebViewRoute("/categories"),
    addWebViewRoute("/conditions-of-sale", {
      alwaysPresentModally: true,
      safeAreaEdges: ["bottom"],
    }),
    addWebViewRoute("/identity-verification-faq"),
    addWebViewRoute("/meet-the-specialists"),
    addWebViewRoute("/orders/:orderID", {
      mimicBrowserBackButton: true,
      useRightCloseButton: true,
      alwaysPresentModally: true,
      safeAreaEdges: ["bottom"],
    }),
    addWebViewRoute("/price-database"),
    addWebViewRoute("/privacy", {
      alwaysPresentModally: true,
      safeAreaEdges: ["bottom"],
    }),
    addWebViewRoute("/terms", {
      alwaysPresentModally: true,
      safeAreaEdges: ["bottom"],
    }),
    addWebViewRoute("/unsubscribe"),

    // Every other route needs to go above
    addRoute("/:slug", "VanityURLEntity"),
    addWebViewRoute("/*"),
  ])

  const routesForDomain = {
    "live.artsy.net": liveDotArtsyDotNet,
    "live-staging.artsy.net": liveDotArtsyDotNet,
    "staging.artsy.net": artsyDotNet,
    "artsy.net": artsyDotNet,
    "www.artsy.net": artsyDotNet,
    [parse(unsafe__getEnvironment().webURL).host ?? "artsy.net"]: artsyDotNet,
  }

  return routesForDomain
}
