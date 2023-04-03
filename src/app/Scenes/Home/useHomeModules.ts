import { ContextModule } from "@artsy/cohesion"
import { articlesQueryVariables } from "app/Scenes/Articles/Articles"
import { isOnboardingVisible } from "app/Scenes/Home/Components/HomeFeedOnboardingRail"
import { HomeProps } from "app/Scenes/Home/Home"
import { lotsByArtistsYouFollowDefaultVariables } from "app/Scenes/LotsByArtistsYouFollow/LotsByArtistsYouFollow"
import { useFeatureFlag } from "app/store/GlobalStore"
import { isEmpty } from "lodash"
import { useMemo } from "react"
import ReactAppboy from "react-native-appboy-sdk"

const HOME_RAILS_SORT = [
  "newWorksForYouRail",
  "contentCardsRail",
  "activeBidsRail",
  "lotsByFollowedArtistsRail",
  "auctionsRail",
  "upcomingAuctionLotsForYouRail",
  "latestAuctionResultsRail",
  "editorialRail",
  "onboardingRail",
  "marketCollectionRail",
  "collectionsRail",
  "artworkRecommendationsRail",
  "newWorksFromGalleriesYouFollowRail",
  "recommendedArtistsRail",
  "trendingArtistsRail",
  "recentlyViewedRail",
  "similarToWorksYouViewedRail",
  "viewingRoomsRail",
  "showsRail",
  "fairsRail",
]

export const useHomeModules = (props: HomeProps, cards: ReactAppboy.CaptionedContentCard[]) => {
  const showUpcomingAuctionResultsRail = useFeatureFlag("ARShowUpcomingAuctionResultsRails")
  const enableCuratorsPickRail = useFeatureFlag("AREnableCuratorsPickRail")

  return useMemo(() => {
    const allModules = [
      // Above-The-Fold Modules
      {
        key: "newWorksForYouRail",
        contextModule: ContextModule.newWorksForYouRail,
        data: props.newWorksForYou,
        isEmpty: isEmpty(props.newWorksForYou),
        title: "New Works for You",
        type: "newWorksForYou",
      },
      {
        key: "contentCardsRail",
        title: "",
        type: "contentCards",
        data: cards,
        isEmpty: isEmpty(cards),
        prefetchUrl: "",
      },
      {
        key: "activeBidsRail",
        data: props.homePageAbove?.activeBidsArtworkModule,
        isEmpty: isEmpty(props.homePageAbove?.activeBidsArtworkModule?.results),
        title: "Your Active Bids",
        type: "artwork",
      },
      {
        key: "lotsByFollowedArtistsRail",
        contextModule: ContextModule.auctionLotsEndingSoonRail,
        data: props.meAbove,
        isEmpty: !props.meAbove?.lotsByFollowedArtistsConnectionCount?.edges?.length,
        prefetchUrl: "/lots-by-artists-you-follow",
        prefetchVariables: lotsByArtistsYouFollowDefaultVariables(),
        title: "Auction Lots for You Ending Soon",
        type: "lotsByFollowedArtists",
      },
      {
        key: "auctionsRail",
        contextModule: ContextModule.auctionRail,
        data: props.homePageAbove?.salesModule,
        isEmpty: isEmpty(props.homePageAbove?.salesModule),
        prefetchUrl: "/auctions",
        subtitle: "Discover and Bid on Works for You",
        title: "Auctions",
        type: "sales",
      },
      // Below-The-Fold Modules
      {
        key: "upcomingAuctionLotsForYouRail",
        title: "Upcoming Auction Lots For You",
        type: "auction-results",
        data: props.meBelow?.auctionResultsByFollowedArtistsUpcoming,
        isEmpty: !props.meBelow?.auctionResultsByFollowedArtistsUpcoming?.totalCount,
        hidden: !showUpcomingAuctionResultsRail,
        contextModule: ContextModule.upcomingAuctionsRail,
      },
      {
        key: "latestAuctionResultsRail",
        title: "Latest Auction Results",
        type: "auction-results",
        data: props.meBelow?.auctionResultsByFollowedArtistsPast,
        isEmpty: !props.meBelow?.auctionResultsByFollowedArtistsPast?.totalCount,
        prefetchUrl: "/auction-results-for-artists-you-follow",
        contextModule: ContextModule.auctionResultsRail,
      },
      {
        key: "editorialRail",
        contextModule: ContextModule.articleRail,
        data: props.articlesConnection,
        hidden: !props.articlesConnection,
        isEmpty: isEmpty(props.articlesConnection),
        prefetchUrl: "/articles",
        prefetchVariables: articlesQueryVariables,
        title: "Artsy Editorial",
        type: "articles",
      },
      {
        key: "onboardingRail",
        data: props.homePageBelow?.onboardingModule,
        hidden: !props.homePageBelow?.onboardingModule,
        isEmpty: !isOnboardingVisible(props.homePageBelow?._onboardingModule),
        title: "Do More on Artsy",
        type: "homeFeedOnboarding",
      },
      {
        key: "marketCollectionRail",
        title: "Curators’ Picks: Emerging",
        subtitle: "The best work by rising talents on Artsy, available now.",
        type: "marketingCollection",
        data: props.emergingPicks,
        isEmpty: isEmpty(props.emergingPicks),
        hidden: !enableCuratorsPickRail,
        contextModule: ContextModule.curatorsPicksEmergingRail,
      },
      {
        key: "collectionsRail",
        contextModule: ContextModule.collectionRail,
        data: props.homePageBelow?.marketingCollectionsModule,
        isEmpty: isEmpty(props.homePageBelow?.marketingCollectionsModule),
        subtitle: "The Newest Works Curated by Artsy",
        title: "Collections",
        type: "collections",
      },
      {
        key: "artworkRecommendationsRail",
        contextModule: ContextModule.artworkRecommendationsRail,
        data: props.meBelow,
        isEmpty: !props.meBelow?.artworkRecommendationsCounts?.totalCount,
        title: "Artwork Recommendations",
        type: "artwork-recommendations",
      },
      {
        key: "newWorksFromGalleriesYouFollowRail",
        contextModule: ContextModule.newWorksByGalleriesYouFollowRail,
        data: props.homePageBelow?.worksFromGalleriesYouFollowArtworkModule,
        isEmpty: isEmpty(props.homePageBelow?.worksFromGalleriesYouFollowArtworkModule?.results),
        title: "New Works from Galleries You Follow",
        type: "artwork",
      },
      {
        key: "recommendedArtistsRail",
        contextModule: ContextModule.recommendedArtistsRail,
        data: props.meBelow,
        isEmpty: !props.meBelow?.artistRecommendationsCounts?.totalCount,
        title: "Recommended Artists",
        type: "recommended-artists",
      },
      {
        key: "trendingArtistsRail",
        contextModule: ContextModule.trendingArtistsRail,
        data: props.homePageBelow?.popularArtistsArtistModule,
        isEmpty: isEmpty(props.homePageBelow?.popularArtistsArtistModule),
        title: "Trending Artists",
        type: "artist",
      },
      {
        key: "recentlyViewedRail",
        contextModule: ContextModule.recentlyViewedRail,
        data: props.homePageBelow?.recentlyViewedWorksArtworkModule,
        isEmpty: isEmpty(props.homePageBelow?.recentlyViewedWorksArtworkModule?.results),
        title: "Recently Viewed",
        type: "artwork",
      },
      {
        key: "similarToWorksYouViewedRail",
        contextModule: ContextModule.similarToWorksYouViewedRail,
        data: props.homePageBelow?.similarToRecentlyViewedArtworkModule,
        isEmpty: isEmpty(props.homePageBelow?.similarToRecentlyViewedArtworkModule?.results),
        title: "Similar to Works You've Viewed",
        type: "artwork",
      },
      {
        key: "viewingRoomsRail",
        contextModule: ContextModule.featuredViewingRoomsRail,
        data: props.featured,
        isEmpty: isEmpty(props.featured),
        prefetchUrl: "/viewing-rooms",
        title: "Viewing Rooms",
        type: "viewing-rooms",
      },
      {
        key: "showsRail",
        contextModule: ContextModule.showsRail,
        data: props.showsByFollowedArtists,
        isEmpty: isEmpty(props.showsByFollowedArtists),
        title: "Shows for You",
        type: "shows",
      },
      {
        key: "fairsRail",
        contextModule: ContextModule.fairRail,
        data: props.homePageBelow?.fairsModule,
        isEmpty: isEmpty(props.homePageBelow?.fairsModule),
        subtitle: "See Works in Top Art Fairs",
        title: "Featured Fairs",
        type: "fairs",
      },
    ]

    return allModules
      .sort((a, b) => HOME_RAILS_SORT.indexOf(a.key) - HOME_RAILS_SORT.indexOf(b.key))
      .filter((module) => !module.hidden && !module.isEmpty)
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
  ])
}
