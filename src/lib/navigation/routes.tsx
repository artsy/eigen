import { AppModule } from "lib/AppRegistry"
import { ArtsyWebViewConfig } from "lib/Components/ArtsyReactWebView"
import { unsafe__getEnvironment, unsafe_getFeatureFlag } from "lib/store/GlobalStore"
import { compact } from "lodash"
import { parse as parseQueryString } from "query-string"
import { Platform } from "react-native"
import { parse } from "url"
import { RouteMatcher } from "./RouteMatcher"

export function matchRoute(
  url: string
): { type: "match"; module: AppModule; params: object } | { type: "external_url"; url: string } {
  const parsed = parse(decodeURIComponent(url))
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

export function webViewRoute(url: string, config?: ArtsyWebViewConfig) {
  return new RouteMatcher(
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

function liveAuctionRouteMatcher(): RouteMatcher {
  const liveBaseURL = unsafe__getEnvironment().predictionURL
  if (Platform.OS === "ios") {
    return new RouteMatcher("/*", "LiveAuction", (params) => ({ slug: params["*"] }))
  } else {
    return webViewRoute("/*", { baseURL: liveBaseURL })
  }
}

function getDomainMap(): Record<string, RouteMatcher[] | null> {
  const liveDotArtsyDotNet: RouteMatcher[] = compact([liveAuctionRouteMatcher()])

  const artsyDotNet: RouteMatcher[] = compact([
    new RouteMatcher("/", "Home"),
    new RouteMatcher("/sales", "Sales"),
    new RouteMatcher("/search", "Search"),
    new RouteMatcher("/inbox", "Inbox"),
    new RouteMatcher("/my-profile", "MyProfile"),

    new RouteMatcher("/artist/:artistID", "Artist"),
    unsafe_getFeatureFlag("AROptionsNewArtistInsightsPage")
      ? new RouteMatcher("/artist/:artistID/shows", "ArtistShows")
      : null,
    new RouteMatcher("/artwork/:artworkID", "Artwork"),
    new RouteMatcher("/artwork/:artworkID/medium", "ArtworkMedium"),
    webViewRoute("/artist/:artistID/auction-results"),
    new RouteMatcher("/artist/:artistID/auction-result/:auctionResultInternalID", "AuctionResult"),
    new RouteMatcher("/artist/:artistID/artist-series", "FullArtistSeriesList"),
    webViewRoute("/artist/:artistID/articles"),
    new RouteMatcher("/artist/:artistID/*", "Artist"),
    // For artists in a gallery context, like https://artsy.net/spruth-magers/artist/astrid-klein . Until we have a native
    // version of the gallery profile/context, we will use the normal native artist view instead of showing a web view.
    new RouteMatcher("/:profile_id_ignored/artist/:artistID", "Artist"),
    new RouteMatcher("/auction-registration/:saleID", "AuctionRegistration"),
    unsafe_getFeatureFlag("AROptionsNewSalePage")
      ? new RouteMatcher("/auction/:saleID", "Auction2")
      : new RouteMatcher("/auction/:id", "Auction"),
    unsafe_getFeatureFlag("AROptionsNewSalePage") ? new RouteMatcher("/auction/:saleID/info", "AuctionInfo") : null,
    new RouteMatcher("/auction-faq", "AuctionFAQ"),
    new RouteMatcher("/auction/:saleID/bid/:artworkID", "AuctionBidArtwork"),
    new RouteMatcher("/gene/:geneID", "Gene"),
    new RouteMatcher("/show/:showID", "Show"),
    new RouteMatcher("/show/:showID/info", "ShowMoreInfo"),

    new RouteMatcher("/inquiry/:artworkID", "Inquiry"),
    new RouteMatcher("/viewing-rooms", "ViewingRooms"),
    new RouteMatcher("/viewing-room/:viewing_room_id", "ViewingRoom"),
    new RouteMatcher("/viewing-room/:viewing_room_id/artworks", "ViewingRoomArtworks"),
    new RouteMatcher("/viewing-room/:viewing_room_id/:artwork_id", "ViewingRoomArtwork"),
    new RouteMatcher("/feature/:slug", "Feature"),
    new RouteMatcher("/artist-series/:artistSeriesID", "ArtistSeries"),
    new RouteMatcher("/collection/:collectionID", "Collection"),
    new RouteMatcher("/collection/:collectionID/artists", "FullFeaturedArtistList"),
    new RouteMatcher("/conversation/:conversationID", "Conversation"),
    new RouteMatcher("/user/conversations/:conversationID", "Conversation"),
    new RouteMatcher("/admin", "Admin"),
    new RouteMatcher("/admin2", "Admin2"),
    new RouteMatcher("/about", "About"),
    new RouteMatcher("/favorites", "Favorites"),
    new RouteMatcher("/my-account", "MyAccount"),
    new RouteMatcher("/my-account/edit-name", "MyAccountEditName"),
    new RouteMatcher("/my-account/edit-password", "MyAccountEditPassword"),
    new RouteMatcher("/my-account/edit-email", "MyAccountEditEmail"),
    new RouteMatcher("/my-account/edit-phone", "MyAccountEditPhone"),
    new RouteMatcher("/my-profile/payment", "MyProfilePayment"),
    new RouteMatcher("/my-profile/payment/new-card", "MyProfilePaymentNewCreditCard"),
    new RouteMatcher("/my-profile/push-notifications", "MyProfilePushNotifications"),
    new RouteMatcher("/local-discovery", "LocalDiscovery"),
    new RouteMatcher("/privacy-request", "PrivacyRequest"),

    new RouteMatcher("/my-collection", "MyCollection"),
    new RouteMatcher("/my-collection/artwork/:artworkSlug", "MyCollectionArtwork"),
    new RouteMatcher("/my-collection/artwork-details/:artworkSlug", "MyCollectionArtworkFullDetails"),
    new RouteMatcher("/my-collection/artwork-images/:artworkSlug", "MyCollectionArtworkImages"),

    // TODO: Follow-up about below route names
    new RouteMatcher("/collections/my-collection/artworks/new/submissions/new", "ConsignmentsSubmissionForm"),
    new RouteMatcher("/consign/submission", "ConsignmentsSubmissionForm"),
    new RouteMatcher("/collections/my-collection/marketing-landing", "SalesNotRootTabView"),

    webViewRoute("/conditions-of-sale"),
    new RouteMatcher("/artwork-classifications", "ArtworkAttributionClassFAQ"),

    new RouteMatcher("/partner-locations/:partnerID", "PartnerLocations"),

    new RouteMatcher("/fair/:fairID", "Fair"),
    new RouteMatcher("/fair/:fairID/artworks", "Fair"),
    new RouteMatcher("/fair/:fairID/artists", "Fair"),
    new RouteMatcher("/fair/:fairID/exhibitors", "Fair"),
    new RouteMatcher("/fair/:fairID/info", "FairMoreInfo"),
    new RouteMatcher("/fair/:fairID/articles", "FairArticles"),
    new RouteMatcher("/fair/:fairID/followedArtists", "FairAllFollowedArtists"),
    new RouteMatcher("/fair/:fairID/bmw-sponsored-content", "FairBMWArtActivation"),

    new RouteMatcher("/city/:citySlug/:section", "CitySectionList"),
    new RouteMatcher("/city-fair/:citySlug", "CityFairList"),
    new RouteMatcher("/city-save/:citySlug", "CitySavedList"),
    new RouteMatcher("/auctions", "Auctions"),
    new RouteMatcher("/works-for-you", "WorksForYou"),
    webViewRoute("/categories"),
    webViewRoute("/privacy"),
    webViewRoute("/identity-verification-faq"),
    webViewRoute("/terms"),
    webViewRoute("/buy-now-feature-faq"),

    new RouteMatcher("/city-bmw-list/:citySlug", "CityBMWList"),
    new RouteMatcher("/make-offer/:artworkID", "MakeOfferModal"),
    unsafe_getFeatureFlag("AROptionsUseReactNativeWebView")
      ? webViewRoute("/orders/:orderID", { mimicBrowserBackButton: false })
      : new RouteMatcher("/orders/:orderID", "Checkout"),

    new RouteMatcher("/:slug", "VanityURLEntity"),
    webViewRoute("/*"),
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
