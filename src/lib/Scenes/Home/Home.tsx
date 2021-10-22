import { Home_articlesConnection } from "__generated__/Home_articlesConnection.graphql"
import { Home_featured } from "__generated__/Home_featured.graphql"
import { Home_homePageAbove } from "__generated__/Home_homePageAbove.graphql"
import { Home_homePageBelow } from "__generated__/Home_homePageBelow.graphql"
import { Home_meAbove } from "__generated__/Home_meAbove.graphql"
import { Home_meBelow } from "__generated__/Home_meBelow.graphql"
import { Home_showsByFollowedArtists } from "__generated__/Home_showsByFollowedArtists.graphql"
import { HomeAboveTheFoldQuery } from "__generated__/HomeAboveTheFoldQuery.graphql"
import { HomeBelowTheFoldQuery } from "__generated__/HomeBelowTheFoldQuery.graphql"
import { AboveTheFoldFlatList } from "lib/Components/AboveTheFoldFlatList"
import { ArtistRailFragmentContainer } from "lib/Components/Home/ArtistRails/ArtistRail"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { ArtworkRailFragmentContainer } from "lib/Scenes/Home/Components/ArtworkRail"
import { AuctionResultsRailFragmentContainer } from "lib/Scenes/Home/Components/AuctionResultsRail"
import { CollectionsRailFragmentContainer } from "lib/Scenes/Home/Components/CollectionsRail"
import { EmailConfirmationBannerFragmentContainer } from "lib/Scenes/Home/Components/EmailConfirmationBanner"
import { FairsRailFragmentContainer } from "lib/Scenes/Home/Components/FairsRail"
import { SaleArtworksHomeRailContainer } from "lib/Scenes/Home/Components/SaleArtworksHomeRail"
import { SalesRailFragmentContainer } from "lib/Scenes/Home/Components/SalesRail"
import { GlobalStore, useFeatureFlag } from "lib/store/GlobalStore"
import { AboveTheFoldQueryRenderer } from "lib/utils/AboveTheFoldQueryRenderer"
import { isPad } from "lib/utils/hardware"
import {
  PlaceholderBox,
  PlaceholderText,
  ProvidePlaceholderContext,
  RandomWidthPlaceholderText,
  useMemoizedRandom,
} from "lib/utils/placeholders"
import { ProvideScreenTracking, Schema } from "lib/utils/track"
import { compact, times } from "lodash"
import { ArtsyLogoIcon, Box, Flex, Join, Spacer } from "palette"
import React, { createRef, RefObject, useEffect, useRef, useState } from "react"
import { Alert, RefreshControl, View, ViewProps } from "react-native"
import { _FragmentRefs, createRefetchContainer, graphql, RelayRefetchProp } from "react-relay"
import { ViewingRoomsHomeRail } from "../ViewingRoom/Components/ViewingRoomsHomeRail"
import { ArticlesRailFragmentContainer } from "./Components/ArticlesRail"
import { HomeHeroContainer } from "./Components/HomeHero"
import { NewWorksForYouRailContainer } from "./Components/NewWorksForYouRail"
import { ShowsRailFragmentContainer } from "./Components/ShowsRail"
import { TroveFragmentContainer } from "./Components/Trove"
import { RailScrollRef } from "./Components/types"

interface HomeModule {
  title: string
  type: string
  data: any
}

interface Props extends ViewProps {
  articlesConnection: Home_articlesConnection | null
  showsByFollowedArtists: Home_showsByFollowedArtists | null
  featured: Home_featured | null
  homePageAbove: Home_homePageAbove | null
  homePageBelow: Home_homePageBelow | null
  loading: boolean
  meAbove: Home_meAbove | null
  meBelow: Home_meBelow | null
  relay: RelayRefetchProp
}

const Home = (props: Props) => {
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

  const enableAuctionResultsByFollowedArtists = useFeatureFlag("ARHomeAuctionResultsByFollowedArtists")
  const enableViewingRooms = useFeatureFlag("AREnableViewingRooms")
  const enableTrove = useFeatureFlag("AREnableTrove")
  const enableNewNewWorksForYouRail = useFeatureFlag("AREnableNewNewWorksForYou")
  const enableShowsForYouRail = useFeatureFlag("AREnableShowsRail")

  // Make sure to include enough modules in the above-the-fold query to cover the whole screen!.
  const modules: HomeModule[] = compact([
    // Above-The-Fold Modules
    {
      title: "New Works for You",
      type: "newWorksForYou",
      data: meAbove,
      enabled: enableNewNewWorksForYouRail,
    },
    {
      title: "New Works by Artists You Follow",
      type: "artwork",
      data: homePageAbove?.followedArtistsArtworkModule,
      enabled: !enableNewNewWorksForYouRail,
    },
    { title: "Your Active Bids", type: "artwork", data: homePageAbove?.activeBidsArtworkModule },
    { title: "Auction Lots for You Ending Soon", type: "lotsByFollowedArtists", data: meAbove },
    { title: "Auctions", type: "sales", data: homePageAbove?.salesModule },
    // Below-The-Fold Modules
    {
      title: "Auction Results for Artists You Follow",
      type: "auction-results",
      data: meBelow,
      enabled: enableAuctionResultsByFollowedArtists,
    },
    {
      title: "Market News",
      type: "articles",
      data: articlesConnection,
      enabled: articlesConnection,
    },
    {
      title: "Shows for You",
      type: "shows",
      data: showsByFollowedArtists,
      enabled: enableShowsForYouRail,
    },
    { title: "Trove", type: "trove", data: homePageBelow, enabled: enableTrove },
    { title: "Viewing Rooms", type: "viewing-rooms", data: featured, enabled: enableViewingRooms },
    { title: "Collections", type: "collections", data: homePageBelow?.marketingCollectionsModule },
    { title: "Featured Fairs", type: "fairs", data: homePageBelow?.fairsModule },
    { title: "Popular Artists", type: "artist", data: homePageBelow?.popularArtistsArtistModule },
    { title: "Recently Viewed", type: "artwork", data: homePageBelow?.recentlyViewedWorksArtworkModule },
    {
      title: "Similar to Works You've Viewed",
      type: "artwork",
      data: homePageBelow?.similarToRecentlyViewedArtworkModule,
    },
  ]).filter((module) => (module.enabled || module.enabled === undefined) && module.data)

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
          data={modules}
          initialNumToRender={5}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
          renderItem={({ item, index, separators }) => {
            if (!item.data) {
              return <></>
            }

            switch (item.type) {
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
                  <ArtworkRailFragmentContainer
                    title={item.title}
                    rail={item.data || null}
                    scrollRef={scrollRefs.current[index]}
                    onShow={() => separators.updateProps("leading", { hideSeparator: false })}
                    onHide={() => separators.updateProps("leading", { hideSeparator: true })}
                  />
                )
              case "auction-results":
                return (
                  <AuctionResultsRailFragmentContainer
                    title={item.title}
                    me={item.data}
                    onShow={() => separators.updateProps("leading", { hideSeparator: false })}
                    onHide={() => separators.updateProps("leading", { hideSeparator: true })}
                  />
                )
              case "collections":
                return (
                  <CollectionsRailFragmentContainer
                    title={item.title}
                    collectionsModule={item.data}
                    scrollRef={scrollRefs.current[index]}
                    onShow={() => separators.updateProps("leading", { hideSeparator: false })}
                  />
                )
              case "fairs":
                return (
                  <FairsRailFragmentContainer
                    title={item.title}
                    fairsModule={item.data}
                    scrollRef={scrollRefs.current[index]}
                  />
                )
              case "lotsByFollowedArtists":
                return (
                  <SaleArtworksHomeRailContainer
                    title={item.title}
                    me={item.data}
                    onShow={() => separators.updateProps("leading", { hideSeparator: false })}
                    onHide={() => separators.updateProps("leading", { hideSeparator: true })}
                  />
                )
              case "newWorksForYou":
                return (
                  <NewWorksForYouRailContainer
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
                    onShow={() => separators.updateProps("leading", { hideSeparator: false })}
                    onHide={() => separators.updateProps("leading", { hideSeparator: true })}
                  />
                )
              case "shows":
                return (
                  <ShowsRailFragmentContainer
                    title={item.title}
                    showsConnection={item.data}
                    onShow={() => separators.updateProps("trailing", { hideSeparator: false })}
                    onHide={() => separators.updateProps("trailing", { hideSeparator: true })}
                  />
                )

              case "trove":
                return (
                  <TroveFragmentContainer
                    trove={item.data}
                    onShow={() => separators.updateProps("trailing", { hideSeparator: false })}
                    onHide={() => separators.updateProps("trailing", { hideSeparator: true })}
                  />
                )
              case "viewing-rooms":
                return <ViewingRoomsHomeRail title={item.title} featured={item.data} />
              default:
                return null
            }
          }}
          ListHeaderComponent={HomeHeader}
          ItemSeparatorComponent={({ hideSeparator }) => (!hideSeparator ? <ModuleSeparator /> : null)}
          ListFooterComponent={() => <Flex mb={3}>{!!loading && <BelowTheFoldPlaceholder />}</Flex>}
          keyExtractor={(_item, index) => String(index)}
        />
        {!!meAbove && <EmailConfirmationBannerFragmentContainer me={meAbove} />}
      </View>
    </ProvideScreenTracking>
  )
}

const HomeHeader: React.FC<{ homePageAbove: Home_homePageAbove | null }> = ({ homePageAbove }) => {
  return (
    <Box mb={1} mt={2}>
      <Flex alignItems="center">
        <ArtsyLogoIcon scale={0.75} />
      </Flex>
      <Spacer mb="15px" />
      {!!homePageAbove && <HomeHeroContainer homePage={homePageAbove} />}
      <Spacer mb="2" />
    </Box>
  )
}

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
        followedArtistsArtworkModule: artworkModule(key: FOLLOWED_ARTISTS) {
          id
          ...ArtworkRail_rail
        }
        activeBidsArtworkModule: artworkModule(key: ACTIVE_BIDS) {
          id
          ...ArtworkRail_rail
        }
        salesModule {
          ...SalesRail_salesModule
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
          ...ArtworkRail_rail
        }
        similarToRecentlyViewedArtworkModule: artworkModule(key: SIMILAR_TO_RECENTLY_VIEWED) {
          id
          ...ArtworkRail_rail
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
        ...SaleArtworksHomeRail_me
        ...NewWorksForYouRail_me
      }
    `,
    meBelow: graphql`
      fragment Home_meBelow on Me {
        ...AuctionResultsRail_me
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

const ModuleSeparator = () => <Spacer mb={6} />

const BelowTheFoldPlaceholder: React.FC = () => {
  const enableViewingRooms = useFeatureFlag("AREnableViewingRooms")

  return (
    <ProvidePlaceholderContext>
      <Flex>
        {!!enableViewingRooms && (
          <Flex ml="2" mt="3">
            <RandomWidthPlaceholderText minWidth={100} maxWidth={200} marginBottom={20} />
            <Flex flexDirection="row">
              {times(4).map((i) => (
                <PlaceholderBox key={i} width={280} height={370} marginRight={15} />
              ))}
            </Flex>
          </Flex>
        )}
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

const HomePlaceholder: React.FC<{}> = () => {
  const enableViewingRooms = useFeatureFlag("AREnableViewingRooms")

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
        times(2).map((r) => (
          <Box key={r} ml={2} mr={2}>
            <RandomWidthPlaceholderText minWidth={100} maxWidth={200} />
            <Flex flexDirection="row" mt={1}>
              <Join separator={<Spacer width={15} />}>
                {times(3 + useMemoizedRandom() * 10).map((index) => (
                  <Flex key={index}>
                    <PlaceholderBox height={120} width={120} />
                    <Spacer mb={2} />
                    <PlaceholderText width={120} />
                    <RandomWidthPlaceholderText minWidth={30} maxWidth={90} />
                    <ModuleSeparator />
                  </Flex>
                ))}
              </Join>
            </Flex>
          </Box>
        ))
      }

      {/* Larger tiles to mimic the fairs, sales, and collections rails */}
      <Box ml={2} mr={2}>
        <RandomWidthPlaceholderText minWidth={100} maxWidth={200} />
        <Flex flexDirection="row" mt={1}>
          <Join separator={<Spacer width={15} />}>
            {times(10).map((index) => (
              <PlaceholderBox key={index} height={270} width={270} />
            ))}
          </Join>
          <ModuleSeparator />
        </Flex>
      </Box>

      {!!enableViewingRooms && (
        <Flex ml="2" mt="3">
          <RandomWidthPlaceholderText minWidth={100} maxWidth={200} marginBottom={20} />
          <Flex flexDirection="row">
            {times(4).map((i) => (
              <PlaceholderBox key={i} width={280} height={370} marginRight={15} />
            ))}
          </Flex>
        </Flex>
      )}
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
  const { flash_message } = GlobalStore.useAppState((state) => state.bottomTabs.sessionState.tabProps.home ?? {}) as {
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
            articlesConnection(first: 10, sort: PUBLISHED_AT_DESC, inEditorialFeed: true) @optionalField {
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
              ...AuctionResultsRail_me
              showsByFollowedArtists(first: 10, status: RUNNING_AND_UPCOMING) @optionalField {
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
