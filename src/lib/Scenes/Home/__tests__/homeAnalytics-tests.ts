import * as Analytics from "@artsy/cohesion"
import { ArtworkRail_rail } from "__generated__/ArtworkRail_rail.graphql"
import HomeAnalytics from "../homeAnalytics"

describe("Events", () => {
  it("returns correct auction events", () => {
    const headerTapEvent = HomeAnalytics.auctionHeaderTapEvent()
    expect(headerTapEvent).toEqual({
      action: Analytics.ActionType.tappedAuctionGroup,
      context_module: Analytics.ContextModule.auctionRail,
      context_screen_owner_type: "home",
      destination_screen_owner_type: "Auctions",
      module_height: "double",
      type: "header",
    })

    const thumbnailTapEvent = HomeAnalytics.auctionThumbnailTapEvent("auction-id", "auction-slug")
    expect(thumbnailTapEvent).toEqual({
      action: Analytics.ActionType.tappedAuctionGroup,
      context_module: Analytics.ContextModule.auctionRail,
      context_screen_owner_type: "home",
      destination_screen_owner_id: "auction-id",
      destination_screen_owner_slug: "auction-slug",
      destination_screen_owner_type: "sale",
      module_height: "double",
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
    const headerTapEvent = HomeAnalytics.artworkHeaderTapEvent(artworkRail.key ?? "unspecified")
    expect(headerTapEvent).toEqual({
      action: Analytics.ActionType.tappedArtworkGroup,
      context_module: Analytics.ContextModule.newWorksByArtistsYouFollowRail,
      context_screen_owner_type: "home",
      destination_screen_owner_type: "worksForYou",
      module_height: "double",
      type: "header",
    })

    const thumbnailTapEvent = HomeAnalytics.artworkThumbnailTapEventFromRail(
      artworkRail.key ?? "unspecified",
      "some-slug"
    )
    expect(thumbnailTapEvent).toEqual({
      action: Analytics.ActionType.tappedArtworkGroup,
      context_module: Analytics.ContextModule.newWorksByArtistsYouFollowRail,
      context_screen_owner_type: "home",
      destination_screen_owner_type: Analytics.OwnerType.artwork,
      destination_screen_owner_slug: "some-slug",
      module_height: "double",
      type: "thumbnail",
    })
  })

  it("returns correct artist events", () => {
    const artistThumbnailTapEvent = HomeAnalytics.artistThumbnailTapEvent("SUGGESTED", "artist-id", "artist-slug")
    expect(artistThumbnailTapEvent).toEqual({
      action: Analytics.ActionType.tappedArtistGroup,
      context_module: Analytics.ContextModule.recommendedArtistsRail,
      context_screen_owner_type: "home",
      destination_screen_owner_id: "artist-id",
      destination_screen_owner_slug: "artist-slug",
      destination_screen_owner_type: "artist",
      module_height: "double",
      type: "thumbnail",
    })
  })

  it("returns correct fairs events", () => {
    const fairThumbnailTapEvent = HomeAnalytics.fairThumbnailTapEvent("fair-id", "fair-slug")
    expect(fairThumbnailTapEvent).toEqual({
      action: Analytics.ActionType.tappedFairGroup,
      context_module: Analytics.ContextModule.fairRail,
      context_screen_owner_type: Analytics.OwnerType.home,
      destination_screen_owner_id: "fair-id",
      destination_screen_owner_slug: "fair-slug",
      destination_screen_owner_type: Analytics.OwnerType.fair,
      module_height: "double",
      type: "thumbnail",
    })
  })
})
