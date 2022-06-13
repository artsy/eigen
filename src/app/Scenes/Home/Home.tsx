import { Home_articlesConnection$data } from "__generated__/Home_articlesConnection.graphql"
import { Home_featured$data } from "__generated__/Home_featured.graphql"
import { Home_homePageAbove$data } from "__generated__/Home_homePageAbove.graphql"
import { Home_homePageBelow$data } from "__generated__/Home_homePageBelow.graphql"
import { Home_meAbove$data } from "__generated__/Home_meAbove.graphql"
import { Home_meBelow$data } from "__generated__/Home_meBelow.graphql"
import { Home_showsByFollowedArtists$data } from "__generated__/Home_showsByFollowedArtists.graphql"
import { HomeAboveTheFoldQuery } from "__generated__/HomeAboveTheFoldQuery.graphql"
import { HomeBelowTheFoldQuery } from "__generated__/HomeBelowTheFoldQuery.graphql"
import { AboveTheFoldFlatList } from "app/Components/AboveTheFoldFlatList"
import { SmallArtworkRailPlaceholder } from "app/Components/ArtworkRail/SmallArtworkRail"
import { ArtistRailFragmentContainer } from "app/Components/Home/ArtistRails/ArtistRail"
import { RecommendedArtistsRailFragmentContainer } from "app/Components/Home/ArtistRails/RecommendedArtistsRail"
import { LotsByFollowedArtistsRailContainer } from "app/Components/LotsByArtistsYouFollowRail/LotsByFollowedArtistsRail"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { ArtworkModuleRailFragmentContainer } from "app/Scenes/Home/Components/ArtworkModuleRail"
import { AuctionResultsRailFragmentContainer } from "app/Scenes/Home/Components/AuctionResultsRail"
import { CollectionsRailFragmentContainer } from "app/Scenes/Home/Components/CollectionsRail"
import { EmailConfirmationBannerFragmentContainer } from "app/Scenes/Home/Components/EmailConfirmationBanner"
import { FairsRailFragmentContainer } from "app/Scenes/Home/Components/FairsRail"
import { SalesRailFragmentContainer } from "app/Scenes/Home/Components/SalesRail"
import { GlobalStore, useFeatureFlag } from "app/store/GlobalStore"
import { AboveTheFoldQueryRenderer } from "app/utils/AboveTheFoldQueryRenderer"
import { isPad } from "app/utils/hardware"
import {
  PlaceholderBox,
  PlaceholderText,
  ProvidePlaceholderContext,
  RandomWidthPlaceholderText,
  useMemoizedRandom,
} from "app/utils/placeholders"
import { usePrefetch } from "app/utils/queryPrefetching"
import { ProvideScreenTracking, Schema } from "app/utils/track"
import { compact, times } from "lodash"
import { ArtsyLogoIcon, Box, Flex, Join, Spacer } from "palette"
import React, { createRef, RefObject, useEffect, useRef, useState } from "react"
import { Alert, RefreshControl, View, ViewProps } from "react-native"
import { createRefetchContainer, graphql, RelayRefetchProp } from "react-relay"
import { articlesQueryVariables } from "../Articles/Articles"
import { lotsByArtistsYouFollowDefaultVariables } from "../LotsByArtistsYouFollow/LotsByArtistsYouFollow"
import { ViewingRoomsHomeMainRail } from "../ViewingRoom/Components/ViewingRoomsHomeRail"
import { ArticlesRailFragmentContainer } from "./Components/ArticlesRail"
import { ArtworkRecommendationsRail } from "./Components/ArtworkRecommendationsRail"
import { HomeHeroContainer } from "./Components/HomeHero"
import { NewWorksForYouRail } from "./Components/NewWorksForYouRail"
import { ShowsRailFragmentContainer } from "./Components/ShowsRail"
import { TroveFragmentContainer } from "./Components/Trove"
import { RailScrollRef } from "./Components/types"

const MODULE_SEPARATOR_HEIGHT = 6

interface HomeModule {
  title: string
  subtitle?: string
  type: string
  data: any
  hidden?: boolean
  prefetchUrl?: string
  prefetchVariables?: object
}

interface Props extends ViewProps {
  articlesConnection: Home_articlesConnection$data | null
  showsByFollowedArtists: Home_showsByFollowedArtists$data | null
  featured: Home_featured$data | null
  homePageAbove: Home_homePageAbove$data | null
  homePageBelow: Home_homePageBelow$data | null
  loading: boolean
  meAbove: Home_meAbove$data | null
  meBelow: Home_meBelow$data | null
  relay: RelayRefetchProp
}

const Home = (props: Props) => {
  const prefetchUrl = usePrefetch()

  useEffect(() => {
    prefetchUrl("search")
    prefetchUrl("my-profile")
    prefetchUrl("inbox")
    prefetchUrl("sales")
  }, [])

  const {
    homePageAbove,
    homePageBelow,
    meAbove,
    meBelow,
    articlesConnection,
    showsByFollowedArtists,
    featured,
    loading,
    relay,
  } = props

  const enableArtworkRecommendations = useFeatureFlag("AREnableHomeScreenArtworkRecommendations")

  // Make sure to include enough modules in the above-the-fold query to cover the whole screen!.
  let modules: HomeModule[] = compact([
    // Above-The-Fold Modules
    {
      title: "New Works for You",
      type: "newWorksForYou",
      data: meAbove,
      prefetchUrl: "/new-works-for-you",
    },
    { title: "Your Active Bids", type: "artwork", data: homePageAbove?.activeBidsArtworkModule },
    {
      title: "Auction Lots for You Ending Soon",
      type: "lotsByFollowedArtists",
      data: meAbove,
      prefetchUrl: "/lots-by-artists-you-follow",
      prefetchVariables: lotsByArtistsYouFollowDefaultVariables(),
    },
    {
      title: "Auctions",
      subtitle: "Discover and bid on works for you",
      type: "sales",
      data: homePageAbove?.salesModule,
      prefetchUrl: "/auctions",
    },
    // Below-The-Fold Modules
    {
      title: "Latest Auction Results",
      type: "auction-results",
      data: meBelow,
      prefetchUrl: "/auction-results-for-artists-you-follow",
    },
    {
      title: "Market News",
      type: "articles",
      data: articlesConnection,
      hidden: !articlesConnection,
      prefetchUrl: "/articles",
      prefetchVariables: articlesQueryVariables,
    },
    {
      title: "Recommended Artists",
      type: "recommended-artists",
      data: meBelow,
    },
    {
      title: "Shows for You",
      type: "shows",
      data: showsByFollowedArtists,
    },
    { title: "Trove", type: "trove", data: homePageBelow },
    {
      title: "Viewing Rooms",
      type: "viewing-rooms",
      data: featured,
      prefetchUrl: "/viewing-rooms",
    },
    {
      title: "Collections",
      subtitle: "The newest works curated by Artsy",
      type: "collections",
      data: homePageBelow?.marketingCollectionsModule,
    },
    {
      title: "Artwork Recommendations",
      type: "artworkRecommendations",
      data: meBelow,
      hidden: !enableArtworkRecommendations,
    },
    {
      title: "Featured Fairs",
      subtitle: "See works in top art fairs",
      type: "fairs",
      data: homePageBelow?.fairsModule,
    },
    { title: "Popular Artists", type: "artist", data: homePageBelow?.popularArtistsArtistModule },
    {
      title: "Recently Viewed",
      type: "artwork",
      data: homePageBelow?.recentlyViewedWorksArtworkModule,
    },
    {
      title: "Similar to Works You've Viewed",
      type: "artwork",
      data: homePageBelow?.similarToRecentlyViewedArtworkModule,
    },
  ])

  modules = modules.filter((module) => !module.hidden && module.data)

  const { isRefreshing, handleRefresh, scrollRefs } = useHandleRefresh(relay, modules)

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
          initialNumToRender={5}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
          prefetchUrlExtractor={(item) => item?.prefetchUrl}
          prefetchVariablesExtractor={(item) => item?.prefetchVariables}
          renderItem={({ item, index }) => {
            if (!item.data) {
              return <></>
            }

            switch (item.type) {
              case "articles":
                return (
                  <ArticlesRailFragmentContainer
                    title={item.title}
                    articlesConnection={item.data}
                    mb={MODULE_SEPARATOR_HEIGHT}
                  />
                )
              case "artist":
                return (
                  <ArtistRailFragmentContainer
                    title={item.title}
                    rail={item.data}
                    scrollRef={scrollRefs.current[index]}
                    mb={MODULE_SEPARATOR_HEIGHT}
                  />
                )
              case "artwork":
                return (
                  <ArtworkModuleRailFragmentContainer
                    title={item.title}
                    rail={item.data || null}
                    scrollRef={scrollRefs.current[index]}
                    mb={MODULE_SEPARATOR_HEIGHT - 2}
                  />
                )
              case "artworkRecommendations":
                return (
                  <ArtworkRecommendationsRail
                    title={item.title}
                    me={item.data || null}
                    scrollRef={scrollRefs.current[index]}
                    mb={MODULE_SEPARATOR_HEIGHT - 2}
                  />
                )
              case "auction-results":
                return (
                  <AuctionResultsRailFragmentContainer
                    title={item.title}
                    me={item.data}
                    mb={MODULE_SEPARATOR_HEIGHT}
                  />
                )
              case "collections":
                return (
                  <CollectionsRailFragmentContainer
                    title={item.title}
                    collectionsModule={item.data}
                    scrollRef={scrollRefs.current[index]}
                    mb={MODULE_SEPARATOR_HEIGHT}
                  />
                )
              case "fairs":
                return (
                  <FairsRailFragmentContainer
                    title={item.title}
                    subtitle={item.subtitle}
                    fairsModule={item.data}
                    scrollRef={scrollRefs.current[index]}
                    mb={MODULE_SEPARATOR_HEIGHT}
                  />
                )
              case "lotsByFollowedArtists":
                return (
                  <LotsByFollowedArtistsRailContainer
                    title={item.title}
                    me={item.data}
                    mb={MODULE_SEPARATOR_HEIGHT}
                  />
                )
              case "newWorksForYou":
                return (
                  <NewWorksForYouRail
                    title={item.title}
                    me={item.data}
                    scrollRef={scrollRefs.current[index]}
                    mb={MODULE_SEPARATOR_HEIGHT}
                  />
                )
              case "recommended-artists":
                return (
                  <RecommendedArtistsRailFragmentContainer
                    title={item.title}
                    me={item.data}
                    scrollRef={scrollRefs.current[index]}
                    mb={MODULE_SEPARATOR_HEIGHT}
                  />
                )
              case "sales":
                return (
                  <SalesRailFragmentContainer
                    title={item.title}
                    salesModule={item.data}
                    scrollRef={scrollRefs.current[index]}
                    mb={MODULE_SEPARATOR_HEIGHT}
                  />
                )
              case "shows":
                return (
                  <ShowsRailFragmentContainer
                    title={item.title}
                    showsConnection={item.data}
                    mb={MODULE_SEPARATOR_HEIGHT}
                  />
                )

              case "trove":
                return <TroveFragmentContainer trove={item.data} mb={MODULE_SEPARATOR_HEIGHT} />
              case "viewing-rooms":
                return (
                  <ViewingRoomsHomeMainRail
                    title={item.title}
                    featured={item.data}
                    mb={MODULE_SEPARATOR_HEIGHT}
                  />
                )
              default:
                return null
            }
          }}
          ListHeaderComponent={HomeHeader}
          ListFooterComponent={() => <Flex mb={3}>{!!loading && <BelowTheFoldPlaceholder />}</Flex>}
          keyExtractor={(_item, index) => String(index)}
        />
        {!!meAbove && <EmailConfirmationBannerFragmentContainer me={meAbove} />}
      </View>
    </ProvideScreenTracking>
  )
}

const HomeHeader: React.FC<{ homePageAbove: Home_homePageAbove$data | null }> = ({
  homePageAbove,
}) => (
  <Box mb={1} mt={2}>
    <Flex alignItems="center">
      <ArtsyLogoIcon scale={0.75} />
    </Flex>
    <Spacer mb="15px" />
    {!!homePageAbove && <HomeHeroContainer homePage={homePageAbove} />}
    <Spacer mb="2" />
  </Box>
)

const useHandleRefresh = (relay: RelayRefetchProp, modules: any[]) => {
  const scrollRefs = useRef<Array<RefObject<RailScrollRef>>>(modules.map((_) => createRef()))
  const scrollRailsToTop = () => scrollRefs.current.forEach((r) => r.current?.scrollToTop())

  const [isRefreshing, setIsRefreshing] = useState(false)
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
}

export const HomeFragmentContainer = createRefetchContainer(
  Home,
  {
    // Make sure not to include modules that are part of "homePageBelow"
    homePageAbove: graphql`
      fragment Home_homePageAbove on HomePage
      @argumentDefinitions(heroImageVersion: { type: "HomePageHeroUnitImageVersion" }) {
        activeBidsArtworkModule: artworkModule(key: ACTIVE_BIDS) {
          id
          ...ArtworkModuleRail_rail
        }
        salesModule {
          ...SalesRail_salesModule
        }
        recommendedArtistsArtistModule: artistModule(key: SUGGESTED) {
          id
          ...ArtistRail_rail
        }
        ...HomeHero_homePage @arguments(heroImageVersion: $heroImageVersion)
      }
    `,
    // Make sure to exclude all modules that are part of "homePageAbove"
    homePageBelow: graphql`
      fragment Home_homePageBelow on HomePage
      @argumentDefinitions(heroImageVersion: { type: "HomePageHeroUnitImageVersion" }) {
        recentlyViewedWorksArtworkModule: artworkModule(key: RECENTLY_VIEWED_WORKS) {
          id
          ...ArtworkModuleRail_rail
        }
        similarToRecentlyViewedArtworkModule: artworkModule(key: SIMILAR_TO_RECENTLY_VIEWED) {
          id
          ...ArtworkModuleRail_rail
        }
        popularArtistsArtistModule: artistModule(key: POPULAR) {
          id
          ...ArtistRail_rail
        }
        fairsModule {
          ...FairsRail_fairsModule
        }
        marketingCollectionsModule {
          ...CollectionsRail_collectionsModule
        }
        ...HomeHero_homePage @arguments(heroImageVersion: $heroImageVersion)
        ...Trove_trove @arguments(heroImageVersion: $heroImageVersion)
      }
    `,
    meAbove: graphql`
      fragment Home_meAbove on Me {
        ...EmailConfirmationBanner_me
        ...LotsByFollowedArtistsRail_me
        ...NewWorksForYouRail_me
      }
    `,
    meBelow: graphql`
      fragment Home_meBelow on Me {
        ...AuctionResultsRail_me
        ...RecommendedArtistsRail_me
        ...ArtworkRecommendationsRail_me
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
  },
  graphql`
    query HomeRefetchQuery($heroImageVersion: HomePageHeroUnitImageVersion!) {
      homePage @optionalField {
        ...Home_homePageAbove @arguments(heroImageVersion: $heroImageVersion)
      }
      homePageBelow: homePage @optionalField {
        ...Home_homePageBelow @arguments(heroImageVersion: $heroImageVersion)
      }
      me @optionalField {
        ...Home_meAbove
        ...AuctionResultsRail_me
        ...RecommendedArtistsRail_me
        ...NewWorksForYouRail_me
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
      articlesConnection(first: 10, sort: PUBLISHED_AT_DESC, inEditorialFeed: true) @optionalField {
        ...Home_articlesConnection
      }
    }
  `
)

const ModuleSeparator = () => <Spacer mb={MODULE_SEPARATOR_HEIGHT} />

const BelowTheFoldPlaceholder: React.FC = () => {
  return (
    <ProvidePlaceholderContext>
      <Flex>
        <Flex ml="2" mt="3">
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
                <Join separator={<Spacer width={15} />}>
                  {times(10).map((index) => (
                    <PlaceholderBox key={index} height={270} width={270} />
                  ))}
                </Join>
                <Spacer mb={2} />
              </Flex>
            </Box>
          </Box>
        ))}
      </Flex>
    </ProvidePlaceholderContext>
  )
}

const HomePlaceholder: React.FC = () => {
  return (
    <Flex>
      <Box mb={1} mt={2}>
        <Flex alignItems="center">
          <ArtsyLogoIcon scale={0.75} />
        </Flex>
      </Box>
      <Spacer mb={4} />

      {
        // Small tiles to mimic the artwork rails
        <Box ml={2} mr={2}>
          <RandomWidthPlaceholderText minWidth={100} maxWidth={200} />
          <Spacer mb={0.3} />
          <Flex flexDirection="row" mt={1}>
            <SmallArtworkRailPlaceholder />
          </Flex>
        </Box>
      }

      <ModuleSeparator />

      {/* Larger tiles to mimic the artist rails */}
      <Box ml={2} mr={2}>
        <RandomWidthPlaceholderText minWidth={100} maxWidth={200} />
        <Spacer mb={0.3} />
        <Flex flexDirection="row" mt={0.5}>
          <Join separator={<Spacer width={15} />}>
            {times(3 + useMemoizedRandom() * 10).map((index) => (
              <Flex key={index}>
                <PlaceholderBox key={index} height={180} width={295} />
                <Spacer mb={1} mt={0.3} />
                <PlaceholderText width={120} />
                <RandomWidthPlaceholderText minWidth={30} maxWidth={90} />
              </Flex>
            ))}
          </Join>
          <ModuleSeparator />
        </Flex>
      </Box>

      <Flex ml="2" mt="3">
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
          query HomeAboveTheFoldQuery($heroImageVersion: HomePageHeroUnitImageVersion) {
            homePage @optionalField {
              ...Home_homePageAbove @arguments(heroImageVersion: $heroImageVersion)
            }
            me @optionalField {
              ...Home_meAbove
              ...NewWorksForYouRail_me
            }
            articlesConnection(first: 10, sort: PUBLISHED_AT_DESC, inEditorialFeed: true)
              @optionalField {
              ...Home_articlesConnection
            }
          }
        `,
        variables: { heroImageVersion: isPad() ? "WIDE" : "NARROW" },
      }}
      below={{
        query: graphql`
          query HomeBelowTheFoldQuery($heroImageVersion: HomePageHeroUnitImageVersion) {
            homePage @optionalField {
              ...Home_homePageBelow @arguments(heroImageVersion: $heroImageVersion)
            }
            featured: viewingRooms(featured: true) @optionalField {
              ...Home_featured
            }
            me @optionalField {
              ...Home_meBelow
              ...RecommendedArtistsRail_me
              ...AuctionResultsRail_me
              showsByFollowedArtists(first: 20, status: RUNNING_AND_UPCOMING) @optionalField {
                ...Home_showsByFollowedArtists
              }
            }
          }
        `,
        variables: { heroImageVersion: isPad() ? "WIDE" : "NARROW" },
      }}
      render={{
        renderComponent: ({ above, below }) => {
          if (!above) {
            throw new Error("no data")
          }

          return (
            <HomeFragmentContainer
              articlesConnection={above?.articlesConnection ?? null}
              showsByFollowedArtists={below?.me?.showsByFollowedArtists ?? null}
              featured={below ? below.featured : null}
              homePageAbove={above.homePage}
              homePageBelow={below ? below.homePage : null}
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
