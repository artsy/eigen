import * as Analytics from "@artsy/cohesion"
import { TappedEntityGroup } from "@artsy/cohesion"
import { ArtworkModuleRail_rail$data } from "__generated__/ArtworkModuleRail_rail.graphql"

type ValidHomeDestination =
  | Analytics.OwnerType.auctions
  | Analytics.OwnerType.sale
  | Analytics.OwnerType.fair
  | Analytics.OwnerType.artwork
  | Analytics.OwnerType.worksForYou
  | Analytics.OwnerType.savesAndFollows
  | Analytics.OwnerType.gene

export default class HomeAnalytics {
  // Auction events

  static auctionHeaderTapEvent(): Analytics.TappedEntityGroup {
    return Analytics.tappedEntityGroup({
      contextModule: Analytics.ContextModule.auctionRail,
      contextScreenOwnerType: Analytics.OwnerType.home,
      destinationScreenOwnerType: Analytics.OwnerType.auctions,
      moduleHeight: "double",
      type: "header",
    })
  }

  static auctionThumbnailTapEvent(
    id?: string,
    slug?: string,
    horizontalSlidePosition?: number
  ): Analytics.TappedEntityGroup {
    return Analytics.tappedEntityGroup({
      contextScreenOwnerType: Analytics.OwnerType.home,
      destinationScreenOwnerId: id,
      destinationScreenOwnerSlug: slug,
      destinationScreenOwnerType: Analytics.OwnerType.sale,
      contextModule: Analytics.ContextModule.auctionRail,
      horizontalSlidePosition,
      moduleHeight: "double",
      type: "thumbnail",
    })
  }

  // Fair events

  static fairThumbnailTapEvent(
    fairID?: string,
    fairSlug?: string,
    index?: number
  ): Analytics.TappedEntityGroup {
    return Analytics.tappedEntityGroup({
      contextScreenOwnerType: Analytics.OwnerType.home,
      destinationScreenOwnerId: fairID,
      destinationScreenOwnerSlug: fairSlug,
      destinationScreenOwnerType: Analytics.OwnerType.fair,
      contextModule: Analytics.ContextModule.fairRail,
      horizontalSlidePosition: index,
      moduleHeight: "double",
      type: "thumbnail",
    })
  }

  // Article events

  static articleThumbnailTapEvent(
    articleID?: string,
    articleSlug?: string,
    index?: number
  ): Analytics.TappedEntityGroup {
    return Analytics.tappedEntityGroup({
      contextScreenOwnerType: Analytics.OwnerType.home,
      destinationScreenOwnerId: articleID,
      destinationScreenOwnerSlug: articleSlug,
      destinationScreenOwnerType: Analytics.OwnerType.article,
      contextModule: Analytics.ContextModule.articleRail,
      horizontalSlidePosition: index,
      moduleHeight: "double",
      type: "thumbnail",
    })
  }

  static articlesHeaderTapEvent(): Analytics.TappedEntityGroup {
    return Analytics.tappedEntityGroup({
      contextModule: Analytics.ContextModule.articleRail,
      contextScreenOwnerType: Analytics.OwnerType.home,
      destinationScreenOwnerType: Analytics.OwnerType.articles,
      moduleHeight: "double",
      type: "header",
    })
  }

  // Artwork Events

  static artworkHeaderTapEvent(key: string | null): Analytics.TappedEntityGroup | null {
    const contextModule = HomeAnalytics.artworkRailContextModule(key)
    const destinationScreen = HomeAnalytics.artworkHeaderDestinationScreen(key)
    if (contextModule && destinationScreen) {
      return Analytics.tappedEntityGroup({
        contextScreenOwnerType: Analytics.OwnerType.home,
        destinationScreenOwnerType: destinationScreen,
        contextModule,
        moduleHeight: "double",
        type: "header",
      })
    } else {
      console.log("homeAnalytics.ts untracked header", key)
      return null
    }
  }

  static artworkThumbnailTapEvent(
    contextModule: Analytics.ContextModule,
    slug: string,
    index?: number,
    moduleHeight?: "single" | "double"
  ): Analytics.TappedEntityGroup {
    return Analytics.tappedEntityGroup({
      contextScreenOwnerType: Analytics.OwnerType.home,
      destinationScreenOwnerType: Analytics.OwnerType.artwork,
      destinationScreenOwnerSlug: slug,
      contextModule,
      horizontalSlidePosition: index,
      moduleHeight: moduleHeight ?? "double",
      type: "thumbnail",
    })
  }

  static artworkThumbnailTapEventFromKey(
    key: string | null,
    slug: string,
    index?: number
  ): Analytics.TappedEntityGroup | null {
    const contextModule = HomeAnalytics.artworkRailContextModule(key)
    if (contextModule) {
      return HomeAnalytics.artworkThumbnailTapEvent(contextModule, slug, index)
    } else {
      console.log("homeAnalytics.ts untracked rail", key)
      return null
    }
  }

  // Artist Events

  static artistThumbnailTapEvent(
    key: string | null,
    id: string,
    slug: string,
    index?: number
  ): Analytics.TappedEntityGroup {
    return Analytics.tappedEntityGroup({
      contextModule: HomeAnalytics.artistRailContextModule(key),
      contextScreenOwnerType: Analytics.OwnerType.home,
      destinationScreenOwnerType: Analytics.OwnerType.artist,
      destinationScreenOwnerId: id,
      destinationScreenOwnerSlug: slug,
      horizontalSlidePosition: index,
      moduleHeight: "double",
      type: "thumbnail",
    })
  }

  // Collections events

  static collectionThumbnailTapEvent(slug?: string, index?: number): TappedEntityGroup {
    return Analytics.tappedEntityGroup({
      contextModule: Analytics.ContextModule.collectionRail,
      contextScreenOwnerType: Analytics.OwnerType.home,
      destinationScreenOwnerType: Analytics.OwnerType.collection,
      destinationScreenOwnerSlug: slug,
      horizontalSlidePosition: index,
      moduleHeight: "double",
      type: "thumbnail",
    })
  }

  // Helpers

  static artworkHeaderDestinationScreen(key: string | null): ValidHomeDestination | null {
    switch (key) {
      case "followed_artists":
        return Analytics.OwnerType.worksForYou
      case "saved_works":
        return Analytics.OwnerType.savesAndFollows
      case "recommended_works":
        return Analytics.OwnerType.worksForYou
      case "genes":
        return Analytics.OwnerType.gene
      default:
        return null
    }
  }

  static destinationScreenSlug(rail: ArtworkModuleRail_rail$data): string | undefined {
    const context = rail.context
    const key = rail.key
    switch (key) {
      case "followed_artist":
      case "related_artists":
        return context?.artist?.href ?? undefined
      case "genes":
      case "current_fairs":
      case "live_auctions":
        return context?.href ?? undefined
      default:
        return undefined
    }
  }

  static artistRailContextModule(key: string | null): Analytics.ContextModule {
    switch (key) {
      case "SUGGESTED":
        return Analytics.ContextModule.recommendedArtistsRail
      case "TRENDING":
        return Analytics.ContextModule.trendingArtistsRail
      case "POPULAR":
        return Analytics.ContextModule.popularArtistsRail
      default:
        return Analytics.ContextModule.recommendedArtistsRail
    }
  }

  static artworkRailContextModule(key: string | null): Analytics.ContextModule | undefined {
    switch (key) {
      case "followed_artists":
        return Analytics.ContextModule.newWorksByArtistsYouFollowRail
      case "followed_galleries":
        return Analytics.ContextModule.newWorksByGalleriesYouFollowRail
      case "recently_viewed_works":
        return Analytics.ContextModule.recentlyViewedRail
      case "saved_works":
        return Analytics.ContextModule.recentlySavedRail
      case "similar_to_saved_works":
        return Analytics.ContextModule.similarToWorksYouSavedRail
      case "similar_to_recently_viewed":
        return Analytics.ContextModule.similarToWorksYouViewedRail
      case "recommended_works":
        return Analytics.ContextModule.recommendedWorksForYouRail
      case "genes":
        return Analytics.ContextModule.categoryRail
    }
  }
}
