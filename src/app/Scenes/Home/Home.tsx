import { ContextModule, OwnerType } from "@artsy/cohesion"
import {
  ArtsyLogoBlackIcon,
  Box,
  Flex,
  Spacer,
  SpacingUnitDSValueNumber,
  Join,
} from "@artsy/palette-mobile"
import { HomeAboveTheFoldQuery } from "__generated__/HomeAboveTheFoldQuery.graphql"
import { HomeBelowTheFoldQuery } from "__generated__/HomeBelowTheFoldQuery.graphql"
import { Home_articlesConnection$data } from "__generated__/Home_articlesConnection.graphql"
import { Home_emergingPicks$data } from "__generated__/Home_emergingPicks.graphql"
import { Home_featured$data } from "__generated__/Home_featured.graphql"
import { Home_homePageAbove$data } from "__generated__/Home_homePageAbove.graphql"
import { Home_homePageBelow$data } from "__generated__/Home_homePageBelow.graphql"
import { Home_meAbove$data } from "__generated__/Home_meAbove.graphql"
import { Home_meBelow$data } from "__generated__/Home_meBelow.graphql"
import { Home_newWorksForYou$data } from "__generated__/Home_newWorksForYou.graphql"
import { Home_showsByFollowedArtists$data } from "__generated__/Home_showsByFollowedArtists.graphql"
import { Search2Query } from "__generated__/Search2Query.graphql"
import { SearchQuery } from "__generated__/SearchQuery.graphql"
import { AboveTheFoldFlatList } from "app/Components/AboveTheFoldFlatList"
import { LargeArtworkRailPlaceholder } from "app/Components/ArtworkRail/LargeArtworkRail"
import { ArtistRailFragmentContainer } from "app/Components/Home/ArtistRails/ArtistRail"
import { RecommendedArtistsRailFragmentContainer } from "app/Components/Home/ArtistRails/RecommendedArtistsRail"
import { LotsByFollowedArtistsRailContainer } from "app/Components/LotsByArtistsYouFollowRail/LotsByFollowedArtistsRail"
import { ActivityIndicator } from "app/Scenes/Home/Components/ActivityIndicator"
import { ArticlesRailFragmentContainer } from "app/Scenes/Home/Components/ArticlesRail"
import { ArtworkModuleRailFragmentContainer } from "app/Scenes/Home/Components/ArtworkModuleRail"
import { ArtworkRecommendationsRail } from "app/Scenes/Home/Components/ArtworkRecommendationsRail"
import { AuctionResultsRail } from "app/Scenes/Home/Components/AuctionResultsRail"
import { CollectionsRailFragmentContainer } from "app/Scenes/Home/Components/CollectionsRail"
import { ContentCards } from "app/Scenes/Home/Components/ContentCards"
import { EmailConfirmationBannerFragmentContainer } from "app/Scenes/Home/Components/EmailConfirmationBanner"
import { FairsRailFragmentContainer } from "app/Scenes/Home/Components/FairsRail"
import { HomeFeedOnboardingRailFragmentContainer } from "app/Scenes/Home/Components/HomeFeedOnboardingRail"
import { HomeHeader } from "app/Scenes/Home/Components/HomeHeader"
import { MarketingCollectionRail } from "app/Scenes/Home/Components/MarketingCollectionRail"
import { MeetYourNewAdvisorRail } from "app/Scenes/Home/Components/MeetYourNewAdvisorRail"
import { NewWorksForYouRail } from "app/Scenes/Home/Components/NewWorksForYouRail"
import { OldCollectionsRailFragmentContainer } from "app/Scenes/Home/Components/OldCollectionsRail"
import { SalesRailFragmentContainer } from "app/Scenes/Home/Components/SalesRail"
import { ShowsRailFragmentContainer } from "app/Scenes/Home/Components/ShowsRail"
import { RailScrollRef } from "app/Scenes/Home/Components/types"
import {
  DEFAULT_RECS_MODEL_VERSION,
  RECOMMENDATION_MODEL_EXPERIMENT_NAME,
} from "app/Scenes/NewWorksForYou/NewWorksForYou"
import { search2QueryDefaultVariables } from "app/Scenes/Search/Search2"
import { ViewingRoomsHomeMainRail } from "app/Scenes/ViewingRoom/Components/ViewingRoomsHomeRail"
import { GlobalStore } from "app/store/GlobalStore"
import { defaultEnvironment } from "app/system/relay/createEnvironment"
import { AboveTheFoldQueryRenderer } from "app/utils/AboveTheFoldQueryRenderer"
import { useExperimentVariant } from "app/utils/experiments/hooks"
import { maybeReportExperimentVariant } from "app/utils/experiments/reporter"
import { isPad } from "app/utils/hardware"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import {
  PlaceholderBox,
  PlaceholderText,
  ProvidePlaceholderContext,
  RandomWidthPlaceholderText,
  useMemoizedRandom,
} from "app/utils/placeholders"
import { usePrefetch } from "app/utils/queryPrefetching"
import { RefreshEvents, HOME_SCREEN_REFRESH_KEY } from "app/utils/refreshHelpers"
import { ProvideScreenTracking, Schema } from "app/utils/track"
import { useMaybePromptForReview } from "app/utils/useMaybePromptForReview"
import { times } from "lodash"
import React, {
  createRef,
  memo,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import {
  Alert,
  ListRenderItem,
  RefreshControl,
  View,
  ViewProps,
  ViewToken,
  ViewabilityConfig,
} from "react-native"
import { createRefetchContainer, graphql, RelayRefetchProp } from "react-relay"

import { useTracking } from "react-tracking"
import { useContentCards } from "./Components/ContentCards"
import HomeAnalytics from "./homeAnalytics"
import { useHomeModules } from "./useHomeModules"

const MODULE_SEPARATOR_HEIGHT: SpacingUnitDSValueNumber = 6

export interface HomeModule {
  // Used for tracking rail views
  contextModule?: ContextModule
  data: any
  hidden?: boolean
  isEmpty: boolean
  prefetchUrl?: string
  prefetchVariables?: object
  key: string
  subtitle?: string
  title: string
  type: string
}

export interface HomeProps extends ViewProps {
  articlesConnection: Home_articlesConnection$data | null
  showsByFollowedArtists: Home_showsByFollowedArtists$data | null
  featured: Home_featured$data | null
  homePageAbove: Home_homePageAbove$data | null
  homePageBelow: Home_homePageBelow$data | null
  newWorksForYou: Home_newWorksForYou$data | null
  loading: boolean
  meAbove: Home_meAbove$data | null
  meBelow: Home_meBelow$data | null
  relay: RelayRefetchProp
  emergingPicks: Home_emergingPicks$data | null
}

const Home = memo((props: HomeProps) => {
  const viewedRails = useRef<Set<string>>(new Set()).current

  const [visibleRails, seVisibleRails] = useState<Set<string>>(new Set())
  useMaybePromptForReview({ contextModule: ContextModule.tabBar, contextOwnerType: OwnerType.home })
  const isESOnlySearchEnabled = useFeatureFlag("AREnableESOnlySearch")
  const prefetchUrl = usePrefetch()
  const tracking = useTracking()

  const { cards } = useContentCards()

  const viewabilityConfig = useRef<ViewabilityConfig>({
    // Percent of of the item that is visible for a partially occluded item to count as "viewable"
    itemVisiblePercentThreshold: 60,
    minimumViewTime: 2000,
    waitForInteraction: false,
  }).current

  useEffect(() => {
    isESOnlySearchEnabled
      ? prefetchUrl<Search2Query>("search2", search2QueryDefaultVariables)
      : prefetchUrl<SearchQuery>("search")
    prefetchUrl("my-profile")
    prefetchUrl("inbox")
    prefetchUrl("sales")
  }, [])

  const { loading, relay } = props

  const enableNewCollectionsRail = useFeatureFlag("AREnableNewCollectionsRail")
  const enableRailViewsTracking = useFeatureFlag("ARImpressionsTrackingHomeRailViews")
  const enableItemViewsTracking = useFeatureFlag("ARImpressionsTrackingHomeItemViews")
  const enableNewSaleArtworkTileRailCard = useFeatureFlag("AREnableNewAuctionsRailCard")

  // Needed to support percentage rollout of the experiment
  const enableRailViewsTrackingExperiment = useExperimentVariant(
    "CX-impressions-tracking-home-rail-views"
  )

  // Make sure to include enough modules in the above-the-fold query to cover the whole screen!.
  const { modules, allModulesKeys } = useHomeModules(props, cards)

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[]; changed: ViewToken[] }) => {
      const newVisibleRails = new Set<string>()

      // Track currently visible rails // needed to enabe tracking artwork views
      if (enableItemViewsTracking) {
        viewableItems.forEach(({ item: { title } }: { item: HomeModule }) => {
          newVisibleRails.add(title)
        })

        seVisibleRails(newVisibleRails)
      }

      // Track all viewed rails
      if (enableRailViewsTracking && enableRailViewsTrackingExperiment.enabled) {
        viewableItems.forEach(({ item: { key, contextModule } }: { item: HomeModule }) => {
          if (contextModule && !viewedRails.has(key)) {
            viewedRails.add(key)
            tracking.trackEvent(
              HomeAnalytics.trackRailViewed({
                contextModule: contextModule,
                positionY: allModulesKeys.findIndex((moduleKey) => moduleKey === key),
              })
            )
          }
        })
      }
    }
  ).current

  const { isRefreshing, handleRefresh, scrollRefs } = useHandleRefresh(relay, modules)

  useEffect(() => {
    RefreshEvents.addListener(HOME_SCREEN_REFRESH_KEY, handleRefresh)

    return () => {
      RefreshEvents.removeListener(HOME_SCREEN_REFRESH_KEY, handleRefresh)
    }
  }, [])

  const renderItem: ListRenderItem<HomeModule> | null | undefined = useCallback(
    ({ item, index }) => {
      if (!item.data) {
        return <></>
      }

      switch (item.type) {
        case "marketingCollection":
          return (
            <MarketingCollectionRail
              contextScreenOwnerType={Schema.OwnerEntityTypes.Home}
              contextModuleKey="curators-picks-emerging"
              home={props.homePageAbove}
              marketingCollection={item.data}
              marketingCollectionSlug="curators-picks-emerging-app"
            />
          )
        case "homeFeedOnboarding":
          return (
            <HomeFeedOnboardingRailFragmentContainer
              title={item.title}
              onboardingModule={item.data}
            />
          )
        case "meetYourNewAdvisor":
          return <MeetYourNewAdvisorRail title={item.title} />
        case "contentCards":
          return <ContentCards cards={item.data} />
        case "articles":
          return <ArticlesRailFragmentContainer title={item.title} articlesConnection={item.data} />
        case "artist":
          return (
            <ArtistRailFragmentContainer
              title={item.title}
              rail={item.data}
              scrollRef={scrollRefs.current[index]}
            />
          )
        case "artwork":
          return (
            <ArtworkModuleRailFragmentContainer
              title={item.title}
              rail={item.data || null}
              scrollRef={scrollRefs.current[index]}
            />
          )
        case "worksByArtistsYouFollow":
          return (
            <ArtworkModuleRailFragmentContainer
              title={item.title}
              rail={item.data || null}
              scrollRef={scrollRefs.current[index]}
            />
          )
        case "artwork-recommendations":
          return (
            <ArtworkRecommendationsRail
              title={item.title}
              me={item.data || null}
              isRailVisible={visibleRails.has(item.title)}
              scrollRef={scrollRefs.current[index]}
            />
          )
        case "collections":
          return enableNewCollectionsRail ? (
            <CollectionsRailFragmentContainer
              title={item.title}
              collectionsModule={item.data}
              scrollRef={scrollRefs.current[index]}
            />
          ) : (
            <OldCollectionsRailFragmentContainer
              title={item.title}
              collectionsModule={item.data}
              scrollRef={scrollRefs.current[index]}
            />
          )
        case "fairs":
          return (
            <FairsRailFragmentContainer
              title={item.title}
              subtitle={item.subtitle}
              fairsModule={item.data}
              scrollRef={scrollRefs.current[index]}
            />
          )
        case "lotsByFollowedArtists":
          return (
            <LotsByFollowedArtistsRailContainer
              title={item.title}
              me={item.data}
              cardSize={enableNewSaleArtworkTileRailCard ? "large" : "small"}
            />
          )
        case "newWorksForYou":
          return (
            <NewWorksForYouRail
              artworkConnection={item.data}
              isRailVisible={visibleRails.has(item.title)}
              scrollRef={scrollRefs.current[index]}
              title={item.title}
            />
          )
        case "recommended-artists":
          return (
            <RecommendedArtistsRailFragmentContainer
              title={item.title}
              me={item.data}
              scrollRef={scrollRefs.current[index]}
            />
          )
        case "sales":
          return (
            <SalesRailFragmentContainer
              title={item.title}
              salesModule={item.data}
              scrollRef={scrollRefs.current[index]}
            />
          )
        case "shows":
          return <ShowsRailFragmentContainer title={item.title} showsConnection={item.data} />
        case "auction-results":
          return (
            <AuctionResultsRail
              title={item.title}
              contextModule={item.contextModule}
              auctionResults={item.data}
            />
          )
        case "viewing-rooms":
          return <ViewingRoomsHomeMainRail title={item.title} featured={item.data} />
        default:
          return null
      }
    },
    [visibleRails]
  )

  return (
    <ProvideScreenTracking
      info={{
        context_screen: Schema.PageNames.Home,
        context_screen_owner_type: null as any,
      }}
    >
      <View style={{ flex: 1 }}>
        <AboveTheFoldFlatList<HomeModule>
          testID="home-flat-list"
          data={modules}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
          prefetchUrlExtractor={(item) => item?.prefetchUrl}
          prefetchVariablesExtractor={(item) => item?.prefetchVariables}
          renderItem={renderItem}
          ListHeaderComponent={<HomeHeader />}
          ListFooterComponent={() => <Flex mb={4}>{!!loading && <BelowTheFoldPlaceholder />}</Flex>}
          ItemSeparatorComponent={ModuleSeparator}
          keyExtractor={(_item) => _item.title}
        />
        {!!props.meAbove && <EmailConfirmationBannerFragmentContainer me={props.meAbove} />}
      </View>
    </ProvideScreenTracking>
  )
})

const useHandleRefresh = (relay: RelayRefetchProp, modules: any[]) => {
  const scrollRefs = useRef<Array<RefObject<RailScrollRef>>>(modules.map((_) => createRef()))
  const [isRefreshing, setIsRefreshing] = useState(false)
  return useMemo(() => {
    const scrollRailsToTop = () => scrollRefs.current.forEach((r) => r.current?.scrollToTop())

    const handleRefresh = async () => {
      setIsRefreshing(true)

      relay.refetch(
        { heroImageVersion: isPad() ? "WIDE" : "NARROW" },
        {},
        (error) => {
          if (error) {
            console.error("Home.tsx - Error refreshing ForYou rails:", error.message)
          }
          setIsRefreshing(false)
          scrollRailsToTop()
        },
        { force: true }
      )
    }

    return { scrollRefs, isRefreshing, handleRefresh }
  }, [modules.join(""), relay])
}

export const HomeFragmentContainer = memo(
  createRefetchContainer(
    Home,
    {
      // Make sure not to include modules that are part of "homePageBelow"
      homePageAbove: graphql`
        fragment Home_homePageAbove on HomePage {
          ...MarketingCollectionRail_home
          activeBidsArtworkModule: artworkModule(key: ACTIVE_BIDS) {
            results {
              id
            }
            ...ArtworkModuleRail_rail
          }
          salesModule {
            ...SalesRail_salesModule
          }
          recommendedArtistsArtistModule: artistModule(key: SUGGESTED) {
            ...ArtistRail_rail
          }
        }
      `,
      // Make sure to exclude all modules that are part of "homePageAbove"
      homePageBelow: graphql`
        fragment Home_homePageBelow on HomePage @argumentDefinitions {
          recentlyViewedWorksArtworkModule: artworkModule(key: RECENTLY_VIEWED_WORKS) {
            results {
              id
            }
            ...ArtworkModuleRail_rail
          }
          similarToRecentlyViewedArtworkModule: artworkModule(key: SIMILAR_TO_RECENTLY_VIEWED) {
            results {
              id
            }
            ...ArtworkModuleRail_rail
          }
          worksFromGalleriesYouFollowArtworkModule: artworkModule(key: FOLLOWED_GALLERIES) {
            results {
              id
            }
            ...ArtworkModuleRail_rail
          }
          popularArtistsArtistModule: artistModule(key: CURATED_TRENDING) {
            ...ArtistRail_rail
          }
          fairsModule {
            ...FairsRail_fairsModule
          }
          marketingCollectionsModule {
            ...OldCollectionsRail_collectionsModule
            ...CollectionsRail_collectionsModule
          }
          _onboardingModule: onboardingModule @optionalField {
            showMyCollectionCard
            showSWACard
          }

          onboardingModule @optionalField {
            ...HomeFeedOnboardingRail_onboardingModule
          }
        }
      `,
      meAbove: graphql`
        fragment Home_meAbove on Me {
          ...EmailConfirmationBanner_me
          lotsByFollowedArtistsConnectionCount: lotsByFollowedArtistsConnection(
            first: 1
            includeArtworksByFollowedArtists: true
            isAuction: true
            liveSale: true
          ) {
            edges {
              node {
                id
              }
            }
          }
          ...LotsByFollowedArtistsRail_me
        }
      `,
      meBelow: graphql`
        fragment Home_meBelow on Me {
          artistRecommendationsCounts: artistRecommendations(first: 1) {
            totalCount
          }
          ...RecommendedArtistsRail_me

          artworkRecommendationsCounts: artworkRecommendations(first: 1) {
            totalCount
          }

          ...ArtworkRecommendationsRail_me

          auctionResultsByFollowedArtistsPast: auctionResultsByFollowedArtists(
            first: 12
            state: PAST
          ) {
            totalCount
            ...AuctionResultsRail_auctionResults
          }

          auctionResultsByFollowedArtistsUpcoming: auctionResultsByFollowedArtists(
            first: 12
            state: UPCOMING
            sort: DATE_ASC
          ) {
            totalCount
            ...AuctionResultsRail_auctionResults
          }
        }
      `,
      articlesConnection: graphql`
        fragment Home_articlesConnection on ArticleConnection {
          ...ArticlesRail_articlesConnection
        }
      `,
      showsByFollowedArtists: graphql`
        fragment Home_showsByFollowedArtists on ShowConnection {
          ...ShowsRail_showsConnection
        }
      `,
      featured: graphql`
        fragment Home_featured on ViewingRoomConnection {
          ...ViewingRoomsListFeatured_featured
        }
      `,
      newWorksForYou: graphql`
        fragment Home_newWorksForYou on Viewer {
          ...NewWorksForYouRail_artworkConnection
        }
      `,
      emergingPicks: graphql`
        fragment Home_emergingPicks on MarketingCollection {
          ...MarketingCollectionRail_marketingCollection
            @arguments(input: { sort: "-decayed_merch" })
        }
      `,
    },
    graphql`
      query HomeRefetchQuery($version: String) {
        homePage @optionalField {
          ...Home_homePageAbove
        }
        homePageBelow: homePage @optionalField {
          ...Home_homePageBelow
        }
        me @optionalField {
          ...Home_meAbove
          ...RecommendedArtistsRail_me
          showsByFollowedArtists(first: 10, status: RUNNING_AND_UPCOMING) @optionalField {
            ...Home_showsByFollowedArtists
          }
        }
        meBelow: me @optionalField {
          ...Home_meBelow
        }
        featured: viewingRooms(featured: true) @optionalField {
          ...Home_featured
        }
        articlesConnection(first: 10, sort: PUBLISHED_AT_DESC, inEditorialFeed: true)
          @optionalField {
          ...Home_articlesConnection
        }
        newWorksForYou: viewer {
          ...Home_newWorksForYou
        }
        emergingPicks: marketingCollection(slug: "curators-picks-emerging") @optionalField {
          ...Home_emergingPicks
        }
      }
    `
  )
)

const ModuleSeparator = () => <Spacer y={MODULE_SEPARATOR_HEIGHT} />

const BelowTheFoldPlaceholder: React.FC = () => {
  return (
    <ProvidePlaceholderContext>
      <Flex>
        <Flex ml={2} mt={4}>
          <RandomWidthPlaceholderText minWidth={100} maxWidth={200} marginBottom={20} />
          <Flex flexDirection="row">
            {times(4).map((i) => (
              <PlaceholderBox key={i} width={280} height={370} marginRight={15} />
            ))}
          </Flex>
        </Flex>

        {times(2).map((r) => (
          <Box key={r}>
            <ModuleSeparator />
            <Box ml={2} mr={2}>
              <RandomWidthPlaceholderText minWidth={100} maxWidth={200} />
              <Flex flexDirection="row">
                <Join separator={<Spacer x="15px" />}>
                  {times(10).map((index) => (
                    <PlaceholderBox key={index} height={270} width={270} />
                  ))}
                </Join>
                <Spacer y={2} />
              </Flex>
            </Box>
          </Box>
        ))}
      </Flex>
    </ProvidePlaceholderContext>
  )
}

const HomePlaceholder: React.FC = () => {
  const randomValue = useMemoizedRandom()

  return (
    <Flex>
      <Box mb={1} mt={2}>
        <Flex alignItems="center">
          <ArtsyLogoBlackIcon scale={0.75} />
          <ActivityIndicator hasUnseenNotifications={false} />
        </Flex>
      </Box>
      <Spacer y={4} />

      {
        // Small tiles to mimic the artwork rails
        <Box ml={2} mr={2}>
          <RandomWidthPlaceholderText minWidth={100} maxWidth={200} />
          <Spacer y={0.5} />
          <Flex flexDirection="row">
            <LargeArtworkRailPlaceholder />
          </Flex>
        </Box>
      }

      <ModuleSeparator />

      {/* Larger tiles to mimic the artist rails */}
      <Box ml={2} mr={2}>
        <RandomWidthPlaceholderText minWidth={100} maxWidth={200} />
        <Spacer y={0.5} />
        <Flex flexDirection="row" mt={0.5}>
          <Join separator={<Spacer x="15px" />}>
            {times(3 + randomValue * 10).map((index) => (
              <Flex key={index}>
                <PlaceholderBox key={index} height={180} width={295} />
                <Spacer y={1} />
                <PlaceholderText width={120} />
                <RandomWidthPlaceholderText minWidth={30} maxWidth={90} />
              </Flex>
            ))}
          </Join>
          <ModuleSeparator />
        </Flex>
      </Box>

      <Flex ml={2} mt={4}>
        <RandomWidthPlaceholderText minWidth={100} maxWidth={200} marginBottom={20} />
        <Flex flexDirection="row">
          {times(4).map((i) => (
            <PlaceholderBox key={i} width={280} height={370} marginRight={15} />
          ))}
        </Flex>
      </Flex>
    </Flex>
  )
}

const messages = {
  confirmed: {
    title: "Email Confirmed",
    message: "Your email has been confirmed.",
  },
  already_confirmed: {
    title: "Already Confirmed",
    message: "You have already confirmed your email.",
  },
  invalid_token: {
    title: "Error",
    message: "An error has occurred. Please contact supportartsy.net.",
  },
  blank_token: {
    title: "Error",
    message: "An error has occurred. Please contact supportartsy.net.",
  },
  expired_token: {
    title: "Link Expired",
    message: "Link expired. Please request a new verification email below.",
  },
}

export const HomeQueryRenderer: React.FC = () => {
  const { flash_message } = GlobalStore.useAppState(
    (state) => state.bottomTabs.sessionState.tabProps.home ?? {}
  ) as {
    flash_message?: string
  }

  const worksForYouRecommendationsModel = useExperimentVariant(RECOMMENDATION_MODEL_EXPERIMENT_NAME)

  useEffect(() => {
    // We would like to trigger the tracking only if the experiment is enabled
    if (worksForYouRecommendationsModel.enabled) {
      maybeReportExperimentVariant({
        experimentName: RECOMMENDATION_MODEL_EXPERIMENT_NAME,
        enabled: worksForYouRecommendationsModel.enabled,
        variantName: worksForYouRecommendationsModel.variant,
        payload: worksForYouRecommendationsModel.payload,
        context_module: ContextModule.newWorksForYouRail,
        context_owner_type: OwnerType.home,
        context_owner_screen: OwnerType.home,
        storeContext: true,
      })
    }
  }, [worksForYouRecommendationsModel.enabled])

  useEffect(() => {
    if (flash_message) {
      const message = messages[flash_message as keyof typeof messages]

      if (!message) {
        console.error(`Invalid flash_message type ${JSON.stringify(flash_message)}`)
        return
      }

      Alert.alert(message.title, message.message, [{ text: "Ok" }])
      // reset the tab props because we don't want this message to show again
      // if the home screen remounts for whatever reason.
      GlobalStore.actions.bottomTabs.setTabProps({ tab: "home", props: {} })
    }
  }, [flash_message])

  return (
    <AboveTheFoldQueryRenderer<HomeAboveTheFoldQuery, HomeBelowTheFoldQuery>
      environment={defaultEnvironment}
      above={{
        query: graphql`
          query HomeAboveTheFoldQuery($version: String!) {
            homePage @optionalField {
              ...Home_homePageAbove
            }
            me @optionalField {
              ...Home_meAbove
            }
            newWorksForYou: viewer @optionalField {
              ...Home_newWorksForYou
            }
          }
        `,
        variables: {
          version: worksForYouRecommendationsModel.payload || DEFAULT_RECS_MODEL_VERSION,
        },
      }}
      below={{
        query: graphql`
          query HomeBelowTheFoldQuery {
            homePage @optionalField {
              ...Home_homePageBelow
            }
            emergingPicks: marketingCollection(slug: "curators-picks-emerging") @optionalField {
              ...Home_emergingPicks
            }
            featured: viewingRooms(featured: true) @optionalField {
              ...Home_featured
            }
            me @optionalField {
              ...Home_meBelow
              ...RecommendedArtistsRail_me
              showsByFollowedArtists(first: 20, status: RUNNING_AND_UPCOMING) @optionalField {
                ...Home_showsByFollowedArtists
              }
            }
            articlesConnection(first: 10, sort: PUBLISHED_AT_DESC, inEditorialFeed: true)
              @optionalField {
              ...Home_articlesConnection
            }
          }
        `,
        variables: {
          version: worksForYouRecommendationsModel.payload || "B",
        },
      }}
      render={{
        renderComponent: ({ above, below }) => {
          if (!above) {
            throw new Error("no data")
          }

          return (
            <HomeFragmentContainer
              articlesConnection={below?.articlesConnection ?? null}
              emergingPicks={below?.emergingPicks ?? null}
              showsByFollowedArtists={below?.me?.showsByFollowedArtists ?? null}
              featured={below ? below.featured : null}
              homePageAbove={above.homePage}
              homePageBelow={below ? below.homePage : null}
              newWorksForYou={above.newWorksForYou}
              meAbove={above.me}
              meBelow={below ? below.me : null}
              loading={!below}
            />
          )
        },
        renderPlaceholder: () => <HomePlaceholder />,
      }}
      cacheConfig={{ force: true }}
      belowTheFoldTimeout={100}
    />
  )
}
