import { compact } from "lodash"
import { parse as parseQueryString } from "query-string"
import { parse } from "url"
import { RouteMatcher } from "./RouteMatcher"

export function matchRoute(url: string): { module: string; params: object } {
  const parsed = parse(url)
  const pathParts = parsed.pathname?.split(/\/+/).filter(Boolean) ?? []
  const queryParams: object = parsed.query ? parseQueryString(parsed.query) : {}

  const domain: keyof typeof routesForDomain = (parsed.host as any) ?? "artsy.net"
  const routes = routesForDomain[domain]

  if (!routes) {
    // Unrecognized domain, let's send the user to Safari or whatever
    return {
      module: "DeviceWebBrowser",
      params: { url },
    }
  }

  for (const route of routes) {
    const result = route.match(pathParts)
    if (result) {
      return {
        module: route.module,
        params: { ...queryParams, ...result },
      }
    }
  }

  // This shouldn't ever happen.
  console.error("Unhandled route", url)
  return {
    module: "FourZeroFour",
    params: { url },
  }
}

const liveDotArtsyDotNet: RouteMatcher[] = compact([new RouteMatcher("/*", "LiveAuction")])

const artsyDotNet: RouteMatcher[] = compact([
  new RouteMatcher("/", "Home"),
  new RouteMatcher("/artist/:id", "Artist"),
  new RouteMatcher("/artwork/:artworkID", "Artwork"),
  new RouteMatcher("/artist/:id/auction-results", "WebView", ({ id }) => ({
    url: `/artist/${id}/auction-results`,
  })),
  // For artists in a gallery context, like https://artsy.net/spruth-magers/artist/astrid-klein . Until we have a native
  // version of the gallery profile/context, we will use the normal native artist view instead of showing a web view.
  new RouteMatcher("/:profile_id_ignored/artist/:id", "Artist"),
  new RouteMatcher("/auction-registration/:id", "AuctionRegistration"),
  new RouteMatcher("/auction/:id", "Auction"),
  new RouteMatcher("/auction/:id/bid/:artwork_id", "AuctionBidArtwork"),
  new RouteMatcher("/gene/:id", "Gene"),
  new RouteMatcher("/show/:id", "Show"),
  new RouteMatcher("/show/:id/artworks", "ShowArtworks"),
  new RouteMatcher("/show/:id/artists", "ShowArtists"),
  new RouteMatcher("/show/:id/info", "ShowMoreInfo"),
  new RouteMatcher("/inquiry/:id", "Inquiry"),
  new RouteMatcher("/viewing-rooms", "ViewingRooms"),
  new RouteMatcher("/viewing-room/:id", "ViewingRoom"),
  new RouteMatcher("/viewing-room/:id/artworks", "ViewingRoomArtworks"),
  new RouteMatcher("/viewing-room/:viewing_room_id/:artwork_id", "ViewingRoomArtwork"),
  new RouteMatcher("/feature/:id", "Feature"),
  new RouteMatcher("/artist-series/:id", "ArtistSeries"),
  new RouteMatcher("/artist/:id/artist-series", "FullArtistSeriesList"),
  new RouteMatcher("/collection/:id", "Collection"),
  new RouteMatcher("/collection/:id/artists", "FullFeaturedArtistList"),
  new RouteMatcher("/conversation/:id", "Conversation"),
  new RouteMatcher("/user/conversations/:id", "Conversation"),
  new RouteMatcher("/admin", "Admin"),
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

  new RouteMatcher("/my-collection/add-artwork", "MyCollectionAddArtwork"),
  new RouteMatcher("/my-collection/artwork-detail/:id", "MyCollectionArtworkDetail"),
  new RouteMatcher("/my-collection/artwork-list", "MyCollectionArtworkList"),
  new RouteMatcher("/my-collection/home", "MyCollectionHome"),
  new RouteMatcher("/my-collection/marketing-home", "MyCollectionMarketingHome"),

  // TODO: Follow-up about below route names
  new RouteMatcher("/collections/my-collection/artworks/new/submissions/new", "NewSubmissionForm"),
  new RouteMatcher("/consign/submission", "Consignments"),
  new RouteMatcher("/collections/my-collection/marketing-landing", "SellTabApp"),

  new RouteMatcher("/conditions-of-sale", "WebView"), // remember present_modally
  new RouteMatcher("/artwork-classifications", "ArtworkAttributionClassFAQ"),

  new RouteMatcher("/partner-locations/:id", "PartnerLocations"),

  new RouteMatcher("/fair/:id/artworks", "FairArtworks"),
  new RouteMatcher("/fair/:id/artists", "FairArtists"),
  new RouteMatcher("/fair/:id/exhibitors", "FairExhibitors"),
  new RouteMatcher("/fair/:id/info", "FairMoreInfo"),
  new RouteMatcher("/fair/:id/bmw-sponsored-content", "FairBMWArtActivation"),
  new RouteMatcher("/city/:city_slug/:section", "CitySectionList"),
  new RouteMatcher("/city-fair/:city_slug", "CityFairList"),
  new RouteMatcher("/city-save/:city_slug", "CitySavedList"),
  new RouteMatcher("/auctions", "Auctions"),
  new RouteMatcher("/works-for-you", "WorksForYou"),
  new RouteMatcher("/categories", "WebView", () => ({ url: "/categories" })),

  new RouteMatcher("/city-bmw-list/:id", "CityBMWList"),
  new RouteMatcher("/:slug", "VanityURLEntity"),

  new RouteMatcher("/*", "WebView", params => ({ url: "/" + params["*"] })),
])

const routesForDomain = {
  "live.artsy.net": liveDotArtsyDotNet,
  "live-staging.artsy.net": liveDotArtsyDotNet,
  "staging.artsy.net": artsyDotNet,
  "artsy.net": artsyDotNet,
  "www.artsy.net": artsyDotNet,
}
