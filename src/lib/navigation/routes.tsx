import { AppModule } from "lib/AppRegistry"
import { getCurrentEmissionState } from "lib/store/GlobalStore"
import { compact } from "lodash"
import { parse as parseQueryString } from "query-string"
import { parse } from "url"
import { RouteMatcher } from "./RouteMatcher"

export function matchRoute(
  url: string
): { type: "match"; module: AppModule; params: object } | { type: "external_url"; url: string } {
  const parsed = parse(url)
  const pathParts = parsed.pathname?.split(/\/+/).filter(Boolean) ?? []
  const queryParams: object = parsed.query ? parseQueryString(parsed.query) : {}

  const domain = parsed.host || "artsy.net"
  const routes = getDomainMap()[domain]

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
    module: "WebView",
    params: { url },
  }
}

function getDomainMap(): Record<string, RouteMatcher[] | null> {
  const liveDotArtsyDotNet: RouteMatcher[] = compact([
    new RouteMatcher("/*", "LiveAuction", (params) => ({ slug: params["*"] })),
  ])

  const artsyDotNet: RouteMatcher[] = compact([
    new RouteMatcher("/", "Home"),
    new RouteMatcher("/sales", "Sales"),
    new RouteMatcher("/search", "Search"),
    new RouteMatcher("/inbox", "Inbox"),
    new RouteMatcher("/my-profile", "MyProfile"),

    new RouteMatcher("/artist/:artistID", "Artist"),
    getCurrentEmissionState().options.AROptionsNewInsightsPage
      ? new RouteMatcher("/artist/:artistID/shows", "ArtistShows")
      : null,
    new RouteMatcher("/artwork/:artworkID", "Artwork"),
    new RouteMatcher("/artist/:artistID/auction-results", "WebView", ({ artistID }) => ({
      url: `/artist/${artistID}/auction-results`,
    })),
    new RouteMatcher("/artist/:artistID/artist-series", "FullArtistSeriesList"),
    new RouteMatcher("/artist/:artistID/articles", "WebView", (params) => ({
      url: "/artist/" + params.artistID + "/articles",
    })),
    new RouteMatcher("/artist/:artistID/*", "Artist"),
    // For artists in a gallery context, like https://artsy.net/spruth-magers/artist/astrid-klein . Until we have a native
    // version of the gallery profile/context, we will use the normal native artist view instead of showing a web view.
    new RouteMatcher("/:profile_id_ignored/artist/:artistID", "Artist"),
    new RouteMatcher("/auction-registration/:id", "AuctionRegistration"),
    getCurrentEmissionState().options.AROptionsNewSalePage
      ? new RouteMatcher("/auction/:saleID", "Auction2")
      : new RouteMatcher("/auction/:id", "Auction"),
    getCurrentEmissionState().options.AROptionsNewSalePage
      ? new RouteMatcher("/auction/:saleID/info", "AuctionInfo")
      : null,
    new RouteMatcher("/auction-faq", "AuctionFAQ"),
    new RouteMatcher("/auction/:id/bid/:artwork_id", "AuctionBidArtwork"),
    new RouteMatcher("/gene/:geneID", "Gene"),
    ...(getCurrentEmissionState().options.AROptionsNewShowPage
      ? [new RouteMatcher("/show/:showID", "Show2"), new RouteMatcher("/show/:showID/info", "Show2MoreInfo")]
      : [new RouteMatcher("/show/:showID", "Show"), new RouteMatcher("/show/:showID/info", "ShowMoreInfo")]),
    new RouteMatcher("/show/:showID/artworks", "ShowArtworks"),
    new RouteMatcher("/show/:showID/artists", "ShowArtists"),

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
    new RouteMatcher("/about", "About"),
    new RouteMatcher("/favorites", "Favorites"),
    new RouteMatcher("/my-account", "MyAccount"),
    new RouteMatcher("/my-account/edit-name", "MyAccountEditName"),
    new RouteMatcher("/my-account/edit-password", "MyAccountEditPassword"),
    new RouteMatcher("/my-account/edit-email", "MyAccountEditEmail"),
    new RouteMatcher("/my-account/edit-phone", "MyAccountEditPhone"),
    new RouteMatcher("/my-bids", "MyBids"),
    new RouteMatcher("/my-profile/payment", "MyProfilePayment"),
    new RouteMatcher("/my-profile/payment/new-card", "MyProfilePaymentNewCreditCard"),
    new RouteMatcher("/my-profile/push-notifications", "MyProfilePushNotifications"),
    new RouteMatcher("/local-discovery", "LocalDiscovery"),
    new RouteMatcher("/privacy-request", "PrivacyRequest"),

    new RouteMatcher("/my-collection", "MyCollection"),
    new RouteMatcher("/my-collection/artwork/:artworkSlug", "MyCollectionArtwork"),
    new RouteMatcher("/my-collection/artwork-details/:artworkSlug", "MyCollectionArtworkFullDetails"),

    // TODO: Follow-up about below route names
    new RouteMatcher("/collections/my-collection/artworks/new/submissions/new", "ConsignmentsSubmissionForm"),
    new RouteMatcher("/consign/submission", "ConsignmentsSubmissionForm"),
    new RouteMatcher("/collections/my-collection/marketing-landing", "SalesNotRootTabView"),

    new RouteMatcher("/conditions-of-sale", "WebView", () => ({ url: "/conditions-of-sale" })),
    new RouteMatcher("/artwork-classifications", "ArtworkAttributionClassFAQ"),

    new RouteMatcher("/partner-locations/:partnerID", "PartnerLocations"),

    new RouteMatcher("/fair/:fairID", "Fair"),
    __DEV__ && new RouteMatcher("/fair2/:fairID", "Fair2"),
    new RouteMatcher("/fair/:fairID/artworks", "FairArtworks"),
    new RouteMatcher("/fair/:fairID/artists", "FairArtists"),
    new RouteMatcher("/fair/:fairID/exhibitors", "FairExhibitors"),
    new RouteMatcher("/fair/:fairID/info", "FairMoreInfo"),
    new RouteMatcher("/fair/:fairID/bmw-sponsored-content", "FairBMWArtActivation"),
    new RouteMatcher("/fair/:fairID/followedArtists", "Fair2AllFollowedArtists"),

    new RouteMatcher("/city/:citySlug/:section", "CitySectionList"),
    new RouteMatcher("/city-fair/:citySlug", "CityFairList"),
    new RouteMatcher("/city-save/:citySlug", "CitySavedList"),
    new RouteMatcher("/auctions", "Auctions"),
    new RouteMatcher("/works-for-you", "WorksForYou"),
    new RouteMatcher("/categories", "WebView", () => ({ url: "/categories" })),
    new RouteMatcher("/privacy", "WebView", () => ({ url: "/privacy" })),
    new RouteMatcher("/identity-verification-faq", "WebView", () => ({ url: "/identity-verification-faq" })),
    new RouteMatcher("/terms", "WebView", () => ({ url: "/terms" })),

    new RouteMatcher("/city-bmw-list/:citySlug", "CityBMWList"),
    new RouteMatcher("/:slug", "VanityURLEntity"),

    new RouteMatcher("/*", "WebView", (params) => ({ url: "/" + params["*"] })),
  ])

  const routesForDomain = {
    "live.artsy.net": liveDotArtsyDotNet,
    "live-staging.artsy.net": liveDotArtsyDotNet,
    "staging.artsy.net": artsyDotNet,
    "artsy.net": artsyDotNet,
    "www.artsy.net": artsyDotNet,
  }

  return routesForDomain
}
