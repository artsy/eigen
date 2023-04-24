import { ContextModule } from "@artsy/cohesion"
import { articlesQueryVariables } from "app/Scenes/Articles/Articles"
import { isOnboardingVisible } from "app/Scenes/Home/Components/HomeFeedOnboardingRail"
import { HomeModule, HomeProps } from "app/Scenes/Home/Home"
import { lotsByArtistsYouFollowDefaultVariables } from "app/Scenes/LotsByArtistsYouFollow/LotsByArtistsYouFollow"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { isEmpty } from "lodash"
import { useMemo } from "react"
import ReactAppboy from "react-native-appboy-sdk"

export const useHomeModules = (props: HomeProps, cards: ReactAppboy.CaptionedContentCard[]) => {
  const showUpcomingAuctionResultsRail = useFeatureFlag("ARShowUpcomingAuctionResultsRails")
  const enableCuratorsPickRail = useFeatureFlag("AREnableCuratorsPickRail")
  const enableDoMoreOnArtsyRail = useFeatureFlag("AREnableDoMoreOnArtsyRail")
  const enableMeetYourNewAdvisoryRail = useFeatureFlag("AREnableMeetYourNewAdvisorRail")

  return useMemo(() => {
    const allModules: Array<HomeModule> = [
      // Above-The-Fold Modules
      {
        contextModule: ContextModule.newWorksForYouRail,
        data: props.newWorksForYou,
        isEmpty: isEmpty(props.newWorksForYou),
        key: "newWorksForYouRail",
        title: "New Works for You",
        type: "newWorksForYou",
      },
      {
        data: cards,
        isEmpty: isEmpty(cards),
        key: "contentCardsRail",
        prefetchUrl: "",
        title: "",
        type: "contentCards",
      },
      {
        data: props.homePageAbove?.activeBidsArtworkModule,
        isEmpty: isEmpty(props.homePageAbove?.activeBidsArtworkModule?.results),
        key: "activeBidsRail",
        title: "Your Active Bids",
        type: "artwork",
      },
      {
        contextModule: ContextModule.auctionLotsEndingSoonRail,
        data: props.meAbove,
        isEmpty: !props.meAbove?.lotsByFollowedArtistsConnectionCount?.edges?.length,
        key: "lotsByFollowedArtistsRail",
        prefetchUrl: "/auctions/lots-for-you-ending-soon",
        prefetchVariables: lotsByArtistsYouFollowDefaultVariables(),
        title: "Auction Lots for You Ending Soon",
        type: "lotsByFollowedArtists",
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
      {
        data: true, // displays static data
        hidden: !enableMeetYourNewAdvisoryRail,
        isEmpty: false, // cannot be empty
        key: "meetYourNewAdvisor",
        title: "Meet your new art advisor",
        type: "meetYourNewAdvisor",
      },
      // Below-The-Fold Modules
      {
        contextModule: ContextModule.upcomingAuctionsRail,
        data: props.meBelow?.auctionResultsByFollowedArtistsUpcoming,
        hidden: !showUpcomingAuctionResultsRail,
        isEmpty: !props.meBelow?.auctionResultsByFollowedArtistsUpcoming?.totalCount,
        key: "upcomingAuctionLotsForYouRail",
        title: "Upcoming Auction Lots For You",
        type: "auction-results",
      },
      {
        contextModule: ContextModule.auctionResultsRail,
        data: props.meBelow?.auctionResultsByFollowedArtistsPast,
        isEmpty: !props.meBelow?.auctionResultsByFollowedArtistsPast?.totalCount,
        key: "latestAuctionResultsRail",
        prefetchUrl: "/auction-results-for-artists-you-follow",
        title: "Latest Auction Results",
        type: "auction-results",
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
        data: props.homePageBelow?.onboardingModule,
        hidden: !props.homePageBelow?.onboardingModule || !enableDoMoreOnArtsyRail,
        isEmpty: !isOnboardingVisible(props.homePageBelow?._onboardingModule),
        key: "onboardingRail",
        title: "Do More on Artsy",
        type: "homeFeedOnboarding",
      },
      {
        contextModule: ContextModule.curatorsPicksEmergingRail,
        data: props.emergingPicks,
        hidden: !enableCuratorsPickRail,
        isEmpty: isEmpty(props.emergingPicks),
        key: "marketCollectionRail",
        subtitle: "The best work by rising talents on Artsy, available now.",
        title: "Curators’ Picks: Emerging",
        type: "marketingCollection",
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
      {
        contextModule: ContextModule.artworkRecommendationsRail,
        data: props.meBelow,
        isEmpty: !props.meBelow?.artworkRecommendationsCounts?.totalCount,
        title: "Artwork Recommendations",
        key: "artworkRecommendationsRail",
        type: "artwork-recommendations",
      },
      {
        contextModule: ContextModule.newWorksByGalleriesYouFollowRail,
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
        data: props.homePageBelow?.recentlyViewedWorksArtworkModule,
        isEmpty: isEmpty(props.homePageBelow?.recentlyViewedWorksArtworkModule?.results),
        key: "recentlyViewedRail",
        title: "Recently Viewed",
        type: "artwork",
      },
      {
        contextModule: ContextModule.similarToWorksYouViewedRail,
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
        data: props.showsByFollowedArtists,
        isEmpty: isEmpty(props.showsByFollowedArtists),
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
    cards,
    props.newWorksForYou,
    props.homePageAbove?.activeBidsArtworkModule,
    props.meAbove,
    props.homePageAbove?.salesModule,
    props.meBelow,
    props.articlesConnection,
    props.homePageBelow?.onboardingModule,
    props.emergingPicks,
    props.homePageBelow?.marketingCollectionsModule,
    props.meBelow,
    props.meBelow,
    props.homePageBelow?.popularArtistsArtistModule,
    props.homePageBelow?.worksFromGalleriesYouFollowArtworkModule,
    props.homePageBelow?.recentlyViewedWorksArtworkModule,
    props.homePageBelow?.similarToRecentlyViewedArtworkModule,
    props.featured,
    props.showsByFollowedArtists,
    props.homePageBelow?.fairsModule,
    showUpcomingAuctionResultsRail,
    enableCuratorsPickRail,
    enableDoMoreOnArtsyRail,
    enableMeetYourNewAdvisoryRail,
  ])
}
