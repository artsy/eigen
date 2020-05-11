import * as Analytics from "@artsy/cohesion"
import { ArtworkRail_rail } from "__generated__/ArtworkRail_rail.graphql"
import HomeAnalytics from "../homeAnalytics"

describe("Events", () => {
  it("returns correct auction events", () => {
    const headerTapEvent = HomeAnalytics.auctionHeaderTapEvent()
    expect(headerTapEvent).toEqual({
      action_name: Analytics.ActionType.tappedAuctionGroup,
      context_module: Analytics.ContextModule.auctionRail,
      context_screen_owner_type: "Home",
      destination_screen: "Auctions",
      type: "header",
    })

    const thumbnailTapEvent = HomeAnalytics.auctionThumbnailTapEvent("auction-id", "auction-slug")
    expect(thumbnailTapEvent).toEqual({
      action_name: Analytics.ActionType.tappedAuctionGroup,
      context_module: Analytics.ContextModule.auctionRail,
      context_screen_owner_type: "Home",
      destination_screen_owner_id: "auction-id",
      destination_screen_owner_slug: "auction-slug",
      destination_screen: "Auction",
      type: "thumbnail",
    })
  })

  it("returns correct artwork events", () => {
    const artworkRail: Pick<ArtworkRail_rail, "title" | "key" | "context"> = {
      title: "some_title",
      key: "followed_artists",
      context: {
        __typename: "HomePageRelatedArtistArtworkModule",
        href: "some-href",
        artist: {
          slug: "artist-slug",
          internalID: "artist-internal-id",
          href: "artist-href",
        },
      },
    }
    const headerTapEvent = HomeAnalytics.artworkHeaderTapEvent(artworkRail as ArtworkRail_rail)
    expect(headerTapEvent).toEqual({
      action_name: Analytics.ActionType.tappedArtworkGroup,
      context_module: Analytics.ContextModule.newWorksByArtistsYouFollowRail,
      context_screen_owner_type: "Home",
      destination_screen_owner_slug: "unspecified",
      destination_screen: "WorksForYou",
      type: "header",
    })

    const thumbnailTapEvent = HomeAnalytics.artworkThumbnailTapEventFromRail(
      artworkRail as ArtworkRail_rail,
      "some-slug"
    )
    expect(thumbnailTapEvent).toEqual({
      action_name: Analytics.ActionType.tappedArtworkGroup,
      context_module: Analytics.ContextModule.newWorksByArtistsYouFollowRail,
      context_screen_owner_type: "Home",
      destination_screen_owner_slug: "some-slug",
      destination_screen: "Artwork",
      type: "thumbnail",
    })
  })

  it("returns correct artist events", () => {
    const artistThumbnailTapEvent = HomeAnalytics.artistThumbnailTapEvent("SUGGESTED", "artist-id", "artist-slug")
    expect(artistThumbnailTapEvent).toEqual({
      action_name: Analytics.ActionType.tappedArtistGroup,
      context_module: Analytics.ContextModule.recommendedArtistsRail,
      context_screen_owner_type: "Home",
      destination_screen_owner_id: "artist-id",
      destination_screen_owner_slug: "artist-slug",
      destination_screen: "Artist",
      type: "thumbnail",
    })

    const artistFollowTapEvent = HomeAnalytics.artistFollowTapEvent("TRENDING", "artist-id", "artist-slug")
    expect(artistFollowTapEvent).toEqual({
      action_name: Analytics.ActionType.tappedArtistGroup,
      context_module: Analytics.ContextModule.trendingArtistsRail,
      context_screen_owner_type: "Home",
      destination_screen_owner_id: "artist-id",
      destination_screen_owner_slug: "artist-slug",
      destination_screen: "Artist",
      type: "follow",
    })
  })

  it("returns correct fairs events", () => {
    const fairThumbnailTapEvent = HomeAnalytics.fairThumbnailTapEvent("fair-id", "fair-slug")
    expect(fairThumbnailTapEvent).toEqual({
      action_name: Analytics.ActionType.tappedFairGroup,
      context_module: Analytics.ContextModule.fairRail,
      context_screen_owner_type: "Home",
      destination_screen_owner_id: "fair-id",
      destination_screen_owner_slug: "fair-slug",
      destination_screen: "Fair",
      type: "thumbnail",
    })
  })
})
