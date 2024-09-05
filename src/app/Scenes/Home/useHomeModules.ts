import { ContextModule, OwnerType } from "@artsy/cohesion"
import { articlesQueryVariables } from "app/Scenes/Articles/Articles"
import { newsArticlesQueryVariables } from "app/Scenes/Articles/News/News"
import { HomeModule, HomeProps } from "app/Scenes/Home/Home"
import { recommendedAuctionLotsDefaultVariables } from "app/Scenes/RecommendedAuctionLots/RecommendedAuctionLots"
import { isConnectionEmpty } from "app/utils/extractNodes"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { isEmpty } from "lodash"
import { useMemo } from "react"

export const useHomeModules = (props: HomeProps) => {
  // ⚠️⚠️⚠️ IMPORTANT: remember when adding a feature flag to also add it to the dependency array of the useMemo hook
  const enableLatestActivityRail = useFeatureFlag("AREnableLatestActivityRail")
  const enableGalleriesForYou = useFeatureFlag("AREnableGalleriesForYou")
  const enableEditorialNews = useFeatureFlag("AREnableEditorialNews")

  return useMemo(() => {
    const allModules: Array<HomeModule> = [
      // Above-The-Fold Modules
      {
        contextModule: ContextModule.activityRail,
        contextScreen: "home",
        contextScreenOwnerType: OwnerType.home,
        data: props.notificationsConnection,
        isEmpty: !props.notificationsConnection?.notificationsConnection?.edges?.length,
        key: "latestActivityRail",
        title: "Latest Activity",
        type: "activity",
        hidden: !enableLatestActivityRail,
      },
      {
        contextModule: ContextModule.newWorksForYouRail,
        contextScreen: "home",
        contextScreenOwnerType: OwnerType.home,
        data: props.newWorksForYou,
        isEmpty: !props.newWorksForYou?.artworksConnection?.edges?.length,
        key: "newWorksForYouRail",
        title: "New Works for You",
        type: "newWorksForYou",
        currentGridOrRail: "NEW_WORKS_FOR_YOU_RAIL",
      },
      {
        data: props.heroUnits?.heroUnitsConnection,
        isEmpty: props.heroUnits?.heroUnitsConnection?.totalCount === 0,
        key: "heroUnitsRail",
        prefetchUrl: "",
        title: "",
        type: "heroUnits",
      },
      // ?
      {
        data: props.homePageAbove?.activeBidsArtworkModule,
        isEmpty: isEmpty(props.homePageAbove?.activeBidsArtworkModule?.results),
        key: "activeBidsRail",
        title: "Your Active Bids",
        type: "artwork",
      },
      {
        contextModule: ContextModule.lotsForYouRail,
        data: props.recommendedAuctionLots,
        isEmpty: isEmpty(props.recommendedAuctionLots),
        key: "recommendedAuctionsRail",
        prefetchVariables: recommendedAuctionLotsDefaultVariables(),
        title: "Auction Lots for You",
        type: "recommendedAuctionLots",
        currentGridOrRail: "AUCTION_LOTS_FOR_YOU_RAIL",
      },
      {
        contextModule: ContextModule.auctionRail,
        data: props.homePageAbove?.salesModule,
        isEmpty: isEmpty(props.homePageAbove?.salesModule),
        key: "auctionsRail",
        prefetchUrl: "/auctions",
        subtitle: "Discover and Bid on Works for You",
        title: "Auctions",
        type: "sales",
      },
      // Below-The-Fold Modules
      {
        contextModule: ContextModule.auctionResultsRail,
        data: props.meBelow?.auctionResultsByFollowedArtistsPast,
        isEmpty: isConnectionEmpty(props.meBelow?.auctionResultsByFollowedArtistsPast),
        key: "latestAuctionResultsRail",
        prefetchUrl: "/auction-results-for-artists-you-follow",
        title: "Latest Auction Results",
        type: "auction-results",
      },
      {
        contextModule: ContextModule.galleriesForYouBanner,
        data: true,
        isEmpty: false,
        key: "galleriesForYouBanner",
        title: "",
        type: "galleriesForYouBanner",
        hidden: !enableGalleriesForYou,
      },
      {
        contextModule: ContextModule.articleRail,
        data: props.articlesConnection,
        hidden: !props.articlesConnection,
        isEmpty: isEmpty(props.articlesConnection),
        key: "editorialRail",
        prefetchUrl: "/articles",
        prefetchVariables: articlesQueryVariables,
        title: "Artsy Editorial",
        type: "articles",
      },
      {
        contextModule: ContextModule.articleRail,
        data: props.news,
        hidden: !enableEditorialNews,
        isEmpty: isEmpty(props.news),
        key: "newsCard",
        prefetchUrl: "/news",
        prefetchVariables: newsArticlesQueryVariables,
        title: "News",
        type: "news",
      },
      {
        contextModule: ContextModule.curatorsPicksEmergingRail,
        contextScreen: "home",
        contextScreenOwnerType: OwnerType.home,
        data: props.emergingPicks,
        isEmpty: isEmpty(props.emergingPicks),
        key: "marketCollectionRail",
        subtitle: "The best work by rising talents on Artsy, available now.",
        title: "Curators’ Picks: Emerging",
        type: "marketingCollection",
        currentGridOrRail: "CURATORS_PICKS_EMERGING_ARTISTS_RAIL",
      },
      {
        contextModule: ContextModule.collectionRail,
        data: props.homePageBelow?.marketingCollectionsModule,
        isEmpty: isEmpty(props.homePageBelow?.marketingCollectionsModule),
        key: "collectionsRail",
        subtitle: "The Newest Works Curated by Artsy",
        title: "Collections",
        type: "collections",
      },
      // ?
      {
        contextModule: ContextModule.artworkRecommendationsRail,
        contextScreen: "home",
        contextScreenOwnerType: OwnerType.home,
        data: props.meBelow,
        isEmpty: !props.meBelow?.artworkRecommendationsCounts?.totalCount,
        title: "Artwork Recommendations",
        key: "artworkRecommendationsRail",
        type: "artwork-recommendations",
      },
      // ?
      {
        contextModule: ContextModule.newWorksByGalleriesYouFollowRail,
        contextScreen: "home",
        contextScreenOwnerType: OwnerType.home,
        data: props.homePageBelow?.worksFromGalleriesYouFollowArtworkModule,
        isEmpty: isEmpty(props.homePageBelow?.worksFromGalleriesYouFollowArtworkModule?.results),
        title: "New Works from Galleries You Follow",
        key: "newWorksFromGalleriesYouFollowRail",
        type: "artwork",
      },
      {
        contextModule: ContextModule.recommendedArtistsRail,
        data: props.meBelow,
        isEmpty: !props.meBelow?.artistRecommendationsCounts?.totalCount,
        key: "recommendedArtistsRail",
        title: "Recommended Artists",
        type: "recommended-artists",
      },
      {
        contextModule: ContextModule.curatedTrendingArtistsRail,
        data: props.homePageBelow?.popularArtistsArtistModule,
        isEmpty: isEmpty(props.homePageBelow?.popularArtistsArtistModule),
        key: "trendingArtistsRail",
        title: "Trending Artists",
        type: "artist",
      },
      {
        contextModule: ContextModule.recentlyViewedRail,
        contextScreen: "home",
        contextScreenOwnerType: OwnerType.home,
        data: props.homePageBelow?.recentlyViewedWorksArtworkModule,
        isEmpty: isEmpty(props.homePageBelow?.recentlyViewedWorksArtworkModule?.results),
        key: "recentlyViewedRail",
        title: "Recently Viewed",
        type: "artwork",
        currentGridOrRail: "RECENTLY_VIEWED_RAIL",
      },
      // ?
      {
        contextModule: ContextModule.similarToWorksYouViewedRail,
        contextScreen: "home",
        contextScreenOwnerType: OwnerType.home,
        data: props.homePageBelow?.similarToRecentlyViewedArtworkModule,
        isEmpty: isEmpty(props.homePageBelow?.similarToRecentlyViewedArtworkModule?.results),
        key: "similarToWorksYouViewedRail",
        title: "Similar to Works You've Viewed",
        type: "artwork",
      },
      {
        contextModule: ContextModule.featuredViewingRoomsRail,
        data: props.featured,
        isEmpty: isEmpty(props.featured),
        prefetchUrl: "/viewing-rooms",
        key: "viewingRoomsRail",
        title: "Viewing Rooms",
        type: "viewing-rooms",
      },
      {
        contextModule: ContextModule.showsRail,
        data: true,
        isEmpty: false,
        key: "showsRail",
        title: "Shows for You",
        type: "shows",
      },
      {
        contextModule: ContextModule.fairRail,
        data: props.homePageBelow?.fairsModule,
        isEmpty: isEmpty(props.homePageBelow?.fairsModule),
        key: "fairsRail",
        subtitle: "See Works in Top Art Fairs",
        title: "Featured Fairs",
        type: "fairs",
      },
    ]

    const modules = allModules.filter((module) => !module.hidden && !module.isEmpty)

    return {
      modules,
      allModulesKeys: allModules.map((module) => module.key),
    }
  }, [
    props.newWorksForYou,
    props.homePageAbove?.activeBidsArtworkModule,
    props.meAbove,
    props.homePageAbove?.salesModule,
    props.meBelow,
    props.articlesConnection,
    props.emergingPicks,
    props.homePageBelow?.marketingCollectionsModule,
    props.meBelow,
    props.meBelow,
    props.homePageBelow?.popularArtistsArtistModule,
    props.homePageBelow?.worksFromGalleriesYouFollowArtworkModule,
    props.homePageBelow?.recentlyViewedWorksArtworkModule,
    props.homePageBelow?.similarToRecentlyViewedArtworkModule,
    props.featured,
    props.notificationsConnection,
    props.homePageBelow?.fairsModule,
    props.recommendedAuctionLots,
    enableLatestActivityRail,
  ])
}
