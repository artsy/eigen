import { AppModule } from "lib/AppRegistry"
import { ArtsyWebViewConfig } from "lib/Components/ArtsyReactWebView"
import { unsafe__getEnvironment, unsafe_getFeatureFlag } from "lib/store/GlobalStore"
import { compact } from "lodash"
import { parse as parseQueryString } from "query-string"
import { Platform } from "react-native"
import { GraphQLTaggedNode } from "relay-runtime"
import { parse } from "url"
import { RouteMatcher } from "./RouteMatcher"

export function matchRoute(
  url: string
):
  | { type: "match"; module: AppModule; query?: GraphQLTaggedNode; params: object }
  | { type: "external_url"; url: string } {
  if (isProtocolEncoded(url)) {
    // if entire url is encoded, decode!
    // Else user will land on VanityUrlEntity for url that otherwise would have been valid
    url = decodeUrl(url)
  }
  let parsed = parse(url)
  if (parsed.host && isEncoded(url)) {
    // likely from a deeplinked universal link as we do not pass urls with host in app
    // special characters in paths passed as props in app must be intentional
    parsed = parse(decodeUrl(url))
  }
  const pathParts = parsed.pathname?.split(/\/+/).filter(Boolean) ?? []
  const queryParams: object = parsed.query ? parseQueryString(parsed.query) : {}

  const domain = (parsed.host || parse(unsafe__getEnvironment().webURL).host) ?? "artsy.net"
  const routes = getDomainMap()[domain as any]

  if (!routes) {
    // Unrecognized domain, let's send the user to Safari or whatever
    return {
      type: "external_url",
      url,
    }
  }

  for (const route of routes) {
    const result = route.match(pathParts)
    if (result) {
      return {
        type: "match",
        module: route.module,
        params: { ...queryParams, ...result },
      }
    }
  }

  // This shouldn't ever happen.
  console.error("Unhandled route", url)
  return {
    type: "match",
    module: unsafe_getFeatureFlag("AROptionsUseReactNativeWebView") ? "ReactWebView" : "WebView",
    params: { url },
  }
}

export const addRoute = (route: string, module: AppModule, paramsMapper?: (val: any) => object) => {
  return new RouteMatcher(route, module, paramsMapper)
}

export function addWebViewRoute(url: string, config?: ArtsyWebViewConfig) {
  return addRoute(
    url,
    unsafe_getFeatureFlag("AROptionsUseReactNativeWebView") ? "ReactWebView" : "WebView",
    (params) => ({
      url: replaceParams(url, params),
      ...config,
    })
  )
}

export function replaceParams(url: string, params: any) {
  url = url.replace(/\*$/, params["*"])
  let match = url.match(/:(\w+)/)
  while (match) {
    const key = match[1]
    if (!(key in params)) {
      console.error("[replaceParams]: something is very wrong", key, params)
      return url
    }
    url = url.replace(":" + key, params[key])
    match = url.match(/:(\w+)/)
  }
  return url
}

function isProtocolEncoded(url: string): boolean {
  const regex = new RegExp("^(http%|https%|%)")
  return regex.test(url)
}

function isEncoded(url: string): boolean {
  return url !== decodeURIComponent(url)
}

function decodeUrl(url: string): string {
  let maxDepth = 10
  // allows to exit the loop in cases of weird custom encoding
  // or for some reason url is encoded more than 10 times
  while (isEncoded(url) && maxDepth > 0) {
    url = decodeURIComponent(url)
    maxDepth--
  }
  return url
}

function getDomainMap(): Record<string, RouteMatcher[] | null> {
  const liveDotArtsyDotNet: RouteMatcher[] = compact([
    Platform.OS === "ios"
      ? addRoute("/*", "LiveAuction", (params) => ({ slug: params["*"] }))
      : addRoute("/*", "ReactWebView", (params) => ({
          url: unsafe__getEnvironment().predictionURL + "/" + params["*"],
        })),
  ])

  const artsyDotNet: RouteMatcher[] = compact([
    addRoute("/", "Home"),
    addRoute("/sales", "Sales"),
    addRoute("/search", "Search"),
    addRoute("/inbox", "Inbox"),
    addRoute("/my-profile", "MyProfile"),
    addRoute("/articles", "Articles"),
    addWebViewRoute("/articles/:articleID"),
    addWebViewRoute("/article/:articleID", { showShareButton: true }),
    addRoute("/artist/:artistID", "Artist"),
    addRoute("/artist/:artistID/shows", "ArtistShows"),
    addRoute("/artwork/:artworkID", "Artwork"),
    addRoute("/artwork/:artworkID/medium", "ArtworkMedium"),
    addRoute("/artist/:artistID/auction-results", "Artist", (params) => ({
      ...params,
      initialTab: "Insights",
    })),
    addRoute("/artist/:artistID/auction-result/:auctionResultInternalID", "AuctionResult"),
    addRoute("/artist/:artistID/artist-series", "FullArtistSeriesList"),
    addRoute("/artist/:artistID/articles", "ArtistArticles"),
    addRoute("/artist/:artistID/*", "Artist"),
    // For artists in a gallery context, like https://www.artsy.net/spruth-magers/artist/astrid-klein . Until we have a native
    // version of the gallery profile/context, we will use the normal native artist view instead of showing a web view.
    addRoute("/:profile_id_ignored/artist/:artistID", "Artist"),
    addRoute("/auction-registration/:saleID", "AuctionRegistration"),
    unsafe_getFeatureFlag("AROptionsNewSalePage")
      ? addRoute("/auction/:saleID", "Auction2")
      : addRoute("/auction/:id", "Auction"),
    unsafe_getFeatureFlag("AROptionsNewSalePage")
      ? addRoute("/auction/:saleID/info", "AuctionInfo")
      : null,
    addRoute("/auction-faq", "AuctionFAQ"),
    addRoute("/auction/:saleID/bid/:artworkID", "AuctionBidArtwork"),
    addRoute("/gene/:geneID", "Gene"),
    addRoute("/tag/:tagID", "Tag"),
    addRoute("/show/:showID", "Show"),
    addRoute("/show/:showID/info", "ShowMoreInfo"),

    addRoute("/inquiry/:artworkID", "Inquiry"),
    addRoute("/viewing-rooms", "ViewingRooms"),
    addRoute("/auction-results-for-artists-you-follow", "AuctionResultsForArtistsYouFollow"),
    addRoute("/viewing-room/:viewing_room_id", "ViewingRoom"),
    addRoute("/viewing-room/:viewing_room_id/artworks", "ViewingRoomArtworks"),
    addRoute("/viewing-room/:viewing_room_id/:artwork_id", "ViewingRoomArtwork"),
    addRoute("/feature/:slug", "Feature"),
    addRoute("/artist-series/:artistSeriesID", "ArtistSeries"),
    addRoute("/collection/:collectionID", "Collection"),
    addRoute("/collection/:collectionID/artists", "FullFeaturedArtistList"),
    addRoute("/conversation/:conversationID", "Conversation"),
    addRoute("/conversation/:conversationID/details", "ConversationDetails"),
    addRoute("/user/conversations/:conversationID", "Conversation"),
    addRoute("/admin", "Admin"),
    addRoute("/admin2", "Admin2"),
    addRoute("/about", "About"),
    addRoute("/favorites", "Favorites"),
    addRoute("/my-account", "MyAccount"),
    addRoute("/my-account/edit-name", "MyAccountEditName"),
    addRoute("/my-account/edit-password", "MyAccountEditPassword"),
    addRoute("/my-account/edit-email", "MyAccountEditEmail"),
    addRoute("/my-account/edit-phone", "MyAccountEditPhone"),
    addRoute("/my-profile/payment", "MyProfilePayment"),
    addRoute("/my-profile/payment/new-card", "MyProfilePaymentNewCreditCard"),
    addRoute("/my-profile/push-notifications", "MyProfilePushNotifications"),
    addRoute("/my-profile/saved-addresses", "SavedAddresses"),
    addRoute("/my-profile/saved-addresses/new-address", "SavedAddressesForm"),
    addRoute("/my-profile/saved-addresses/edit-address", "SavedAddressesForm"),
    addRoute("/my-profile/settings", "MyProfileSettings"),
    addRoute("/settings/dark-mode", "DarkModeSettings"),
    addRoute("/local-discovery", "LocalDiscovery"),
    addRoute("/privacy-request", "PrivacyRequest"),

    addRoute("/orders", "OrderHistory"),

    addRoute("/my-account", "MyAccount"),

    addRoute("/my-collection", "MyCollection"),
    addRoute("/my-collection/artwork/:artworkSlug", "MyCollectionArtwork"),
    addRoute("/my-collection/artwork-details/:artworkSlug", "MyCollectionArtworkFullDetails"),
    addRoute("/my-collection/artworks/new", "AddOrEditMyCollectionArtwork"),
    addRoute("/my-collection/artworks/:artworkID/edit", "AddOrEditMyCollectionArtwork"),

    // TODO: Follow-up about below route names
    addRoute(
      "/collections/my-collection/artworks/new/submissions/new",
      "ConsignmentsSubmissionForm"
    ),
    addRoute("/consign/submission", "ConsignmentsSubmissionForm"),
    addRoute("/collections/my-collection/marketing-landing", "SalesNotRootTabView"),

    addWebViewRoute("/conditions-of-sale"),
    addRoute("/artwork-classifications", "ArtworkAttributionClassFAQ"),
    addRoute("/artwork-submission-status", "ArtworkSubmissionStatusFAQ"),

    addRoute("/partner/:partnerID", "Partner"),
    addRoute("/partner/:partnerID/works", "Partner"),
    addRoute("/partner/:partnerID/artists/:artistID", "Partner"),
    addRoute("/partner-locations/:partnerID", "PartnerLocations"),

    addRoute("/fair/:fairID", "Fair"),
    addRoute("/fair/:fairID/artworks", "Fair"),
    addRoute("/fair/:fairID/artists", "Fair"),
    addRoute("/fair/:fairID/exhibitors", "Fair"),
    addRoute("/fair/:fairID/info", "FairMoreInfo"),
    addRoute("/fair/:fairID/articles", "FairArticles"),
    addRoute("/fair/:fairID/followedArtists", "FairAllFollowedArtists"),
    addRoute("/fair/:fairID/bmw-sponsored-content", "FairBMWArtActivation"),

    addRoute("/city/:citySlug/:section", "CitySectionList"),
    addRoute("/city-fair/:citySlug", "CityFairList"),
    addRoute("/city-save/:citySlug", "CitySavedList"),
    addRoute("/auctions", "Auctions"),
    addRoute("/lots-by-artists-you-follow", "LotsByArtistsYouFollow"),
    addRoute("/works-for-you", "WorksForYou"),
    addRoute("/new-works-for-you", "NewWorksForYou"),
    addWebViewRoute("/categories"),
    addWebViewRoute("/privacy"),
    addWebViewRoute("/identity-verification-faq"),
    addWebViewRoute("/terms"),
    addWebViewRoute("/buy-now-feature-faq"),
    addWebViewRoute("/buyer-guarantee"),
    addWebViewRoute("/unsubscribe"),

    addRoute("/city-bmw-list/:citySlug", "CityBMWList"),
    addRoute("/make-offer/:artworkID", "MakeOfferModal"),
    addRoute("/user/purchases/:orderID", "OrderDetails"),
    addRoute("/my-profile/saved-search-alerts", "SavedSearchAlertsList"),
    addRoute("/my-profile/saved-search-alerts/:savedSearchAlertId", "EditSavedSearchAlert"),
    unsafe_getFeatureFlag("AROptionsUseReactNativeWebView")
      ? addWebViewRoute("/orders/:orderID", {
          mimicBrowserBackButton: true,
          useRightCloseButton: true,
        })
      : addRoute("/orders/:orderID", "Checkout"),
    __DEV__ && addRoute("/storybook", "Storybook"),

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
