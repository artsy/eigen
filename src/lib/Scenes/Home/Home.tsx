import { Home_articlesConnection } from "__generated__/Home_articlesConnection.graphql"
import { Home_featured } from "__generated__/Home_featured.graphql"
import { Home_homePage } from "__generated__/Home_homePage.graphql"
import { Home_homePageAbove } from "__generated__/Home_homePageAbove.graphql"
import { Home_me } from "__generated__/Home_me.graphql"
import { Home_meAbove } from "__generated__/Home_meAbove.graphql"
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
import { compact, drop, flatten, times, zip } from "lodash"
import { ArtsyLogoIcon, Box, Flex, Join, Spacer, Theme } from "palette"
import React, { createRef, RefObject, useEffect, useRef, useState } from "react"
import { Alert, Platform, RefreshControl, View, ViewProps } from "react-native"
import { _FragmentRefs, createRefetchContainer, graphql, RelayRefetchProp } from "react-relay"
import { ViewingRoomsHomeRail } from "../ViewingRoom/Components/ViewingRoomsHomeRail"
import { ArticlesRailFragmentContainer } from "./Components/ArticlesRail"
import { HomeHeroContainer } from "./Components/HomeHero"
import { RailScrollRef } from "./Components/types"

interface Props extends ViewProps {
  articlesConnection: Home_articlesConnection | null
  homePage: Home_homePage | null
  homePageAbove: Home_homePageAbove | null
  me: Home_me | null
  meAbove: Home_meAbove | null
  featured: Home_featured | null
  relay: RelayRefetchProp
  loading: boolean
}

const Home = (props: Props) => {
  const { articlesConnection, homePage, homePageAbove, me, meAbove, featured, loading } = props

  const artworkModules = (homePageAbove?.artworkModules || []).concat(homePage?.artworkModules || [])
  const salesModule = homePageAbove?.salesModule
  const collectionsModule = homePage?.marketingCollectionsModule
  const artistModules = (homePage?.artistModules && homePage?.artistModules.concat()) || []
  const fairsModule = homePage?.fairsModule

  const enableAuctionResultsByFollowedArtists = useFeatureFlag("ARHomeAuctionResultsByFollowedArtists")

  const artworkRails = artworkModules.map(
    (module) =>
      module &&
      ({
        type: "artwork",
        data: module,
      } as const)
  )
  const artistRails = artistModules.map(
    (module) =>
      module &&
      ({
        type: "artist",
        data: module,
      } as const)
  )

  const viewingRoomsEchoFlag = useFeatureFlag("AREnableViewingRooms")

  /*
  Ordering is defined in https://www.notion.so/artsy/App-Home-Screen-4841255ded3f47c9bcdb73185ee3f335.
  Please make sure to keep this page in sync with the home screen and include at least the first ~4 modules
  in `HomeAboveTheFoldQuery`.
  */
  const rowData = compact([
    // Above the fold modules
    artworkRails[0],
    { type: "lotsByFollowedArtists" } as const,
    artworkRails[1],
    salesModule &&
      ({
        type: "sales",
        data: salesModule,
      } as const),
    // Below the fold modules
    !!articlesConnection && ({ type: "articles" } as const),
    !!viewingRoomsEchoFlag && !!featured && ({ type: "viewing-rooms" } as const),
    fairsModule &&
      ({
        type: "fairs",
        data: fairsModule,
      } as const),
    collectionsModule &&
      ({
        type: "collections",
        data: collectionsModule,
      } as const),
    enableAuctionResultsByFollowedArtists &&
      ({
        type: "auction-results",
      } as const),
    ...flatten(zip(drop(artworkRails, 2), artistRails)),
  ])

  const scrollRefs = useRef<Array<RefObject<RailScrollRef>>>(rowData.map((_) => createRef()))
  const scrollRailsToTop = () => scrollRefs.current.forEach((r) => r.current?.scrollToTop())

  const [isRefreshing, setIsRefreshing] = useState(false)
  const handleRefresh = async () => {
    setIsRefreshing(true)

    props.relay.refetch(
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

  return (
    <ProvideScreenTracking
      info={{
        context_screen: Schema.PageNames.Home,
        context_screen_owner_type: null as any,
      }}
    >
      <Theme>
        <View style={{ flex: 1 }}>
          <AboveTheFoldFlatList
            data={rowData}
            initialNumToRender={5}
            refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
            renderItem={({ item, index, separators }) => {
              switch (item.type) {
                case "articles":
                  return <ArticlesRailFragmentContainer articlesConnection={articlesConnection} />
                case "artwork":
                  return <ArtworkRailFragmentContainer rail={item.data} scrollRef={scrollRefs.current[index]} />
                case "artist":
                  return <ArtistRailFragmentContainer rail={item.data} scrollRef={scrollRefs.current[index]} />
                case "fairs":
                  return <FairsRailFragmentContainer fairsModule={item.data} scrollRef={scrollRefs.current[index]} />
                case "sales":
                  return <SalesRailFragmentContainer salesModule={item.data} scrollRef={scrollRefs.current[index]} />
                case "collections":
                  return (
                    <CollectionsRailFragmentContainer
                      collectionsModule={item.data}
                      scrollRef={scrollRefs.current[index]}
                    />
                  )
                case "viewing-rooms":
                  return <ViewingRoomsHomeRail featured={featured} />

                case "auction-results":
                  return <AuctionResultsRailFragmentContainer me={me} scrollRef={scrollRefs.current[index]} />
                case "lotsByFollowedArtists":
                  return (
                    <SaleArtworksHomeRailContainer
                      me={me}
                      onShow={() => separators.updateProps("leading", { hideSeparator: false })}
                      onHide={() => separators.updateProps("leading", { hideSeparator: true })}
                    />
                  )
              }
            }}
            ListHeaderComponent={
              <Box mb={1} mt={2}>
                <Flex alignItems="center">
                  <ArtsyLogoIcon scale={0.75} />
                </Flex>
                <Spacer mb="15px" />
                <HomeHeroContainer homePage={homePage} />
                <Spacer mb="2" />
              </Box>
            }
            ItemSeparatorComponent={({ hideSeparator }) => (!hideSeparator ? <Spacer mb={3} /> : null)}
            ListFooterComponent={() => <Spacer mb={3} />}
            keyExtractor={(_item, index) => String(index)}
          />
          <EmailConfirmationBannerFragmentContainer me={me} />
        </View>
      </Theme>
    </ProvideScreenTracking>
  )
}

export const HomeFragmentContainer = createRefetchContainer(
  Home,
  {
    // Make sure to exclude all modules that are part of "homePage"
    homePageAbove: graphql`
      fragment Home_homePageAbove on HomePage
      @argumentDefinitions(heroImageVersion: { type: "HomePageHeroUnitImageVersion" }) {
        artworkModules(
          maxRails: 2
          maxFollowedGeneRails: -1
          order: [ACTIVE_BIDS, FOLLOWED_ARTISTS, RECENTLY_VIEWED_WORKS]
          include: [ACTIVE_BIDS, FOLLOWED_ARTISTS, RECENTLY_VIEWED_WORKS]
        ) {
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
    homePage: graphql`
      fragment Home_homePage on HomePage
      @argumentDefinitions(heroImageVersion: { type: "HomePageHeroUnitImageVersion" }) {
        artworkModules(
          maxRails: -1
          maxFollowedGeneRails: -1
          order: [RECOMMENDED_WORKS, FOLLOWED_GALLERIES]
          # LIVE_AUCTIONS and CURRENT_FAIRS both have their own modules, below.
          # Make sure to exclude all modules that are part of "homePageAbove"
          exclude: [
            RECENTLY_VIEWED_WORKS
            ACTIVE_BIDS
            FOLLOWED_ARTISTS
            SAVED_WORKS
            GENERIC_GENES
            LIVE_AUCTIONS
            CURRENT_FAIRS
            RELATED_ARTISTS
            FOLLOWED_GENES
          ]
        ) {
          id
          ...ArtworkRail_rail
        }
        artistModules {
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
      }
    `,
    meAbove: graphql`
      fragment Home_meAbove on Me {
        ...EmailConfirmationBanner_me
        ...SaleArtworksHomeRail_me
      }
    `,
    me: graphql`
      fragment Home_me on Me {
        ...AuctionResultsRail_me
      }
    `,
    articlesConnection: graphql`
      fragment Home_articlesConnection on ArticleConnection {
        ...ArticlesRail_articlesConnection
      }
    `,
    featured: graphql`
      fragment Home_featured on ViewingRoomConnection {
        ...ViewingRoomsListFeatured_featured
      }
    `,
  },
  graphql`
    query HomeRefetchQuery {
      articlesConnection(first: 10, sort: PUBLISHED_AT_DESC, inEditorialFeed: true) @optionalField {
        ...Home_articlesConnection
      }
    }
  `
)

const HomeLoadingPlaceholder: React.FC<{}> = () => (
  <ProvidePlaceholderContext>
    <Theme>
      <Flex>
        {/* Larger tiles to mimic the fairs, sales, and collections rails */}
        <Box ml={2} mr={2}>
          <RandomWidthPlaceholderText minWidth={100} maxWidth={200} />
          <Flex flexDirection="row" mt={1}>
            <Join separator={<Spacer width={15} />}>
              {times(10).map((index) => (
                <PlaceholderBox key={index} height={270} width={270} />
              ))}
            </Join>
            <Spacer mb={2} />
          </Flex>
        </Box>
      </Flex>
    </Theme>
  </ProvidePlaceholderContext>
)

const HomePlaceholder: React.FC<{}> = () => {
  const viewingRoomsEchoFlag = useFeatureFlag("AREnableViewingRooms")

  return (
    <Theme>
      <Flex>
        <Box mb={1} mt={2}>
          <Flex alignItems="center">
            <ArtsyLogoIcon scale={0.75} />
          </Flex>
        </Box>

        {
          // Small tiles to mimic the artwork rails
          times(2).map((r) => (
            <Box key={r} ml={2} mr={2}>
              <Spacer mb={3} />
              <RandomWidthPlaceholderText minWidth={100} maxWidth={200} />
              <Flex flexDirection="row" mt={1}>
                <Join separator={<Spacer width={15} />}>
                  {times(3 + useMemoizedRandom() * 10).map((index) => (
                    <Flex key={index}>
                      <PlaceholderBox height={120} width={120} />
                      <Spacer mb={2} />
                      <PlaceholderText width={120} />
                      <RandomWidthPlaceholderText minWidth={30} maxWidth={90} />
                    </Flex>
                  ))}
                </Join>
                <Spacer mb={2} />
              </Flex>
            </Box>
          ))
        }

        {/* Larger tiles to mimic the fairs, sales, and collections rails */}
        <Box ml={2} mr={2}>
          <Spacer mb={3} />
          <RandomWidthPlaceholderText minWidth={100} maxWidth={200} />
          <Flex flexDirection="row" mt={1}>
            <Join separator={<Spacer width={15} />}>
              {times(10).map((index) => (
                <PlaceholderBox key={index} height={270} width={270} />
              ))}
            </Join>
            <Spacer mb={2} />
          </Flex>
        </Box>

        {!!viewingRoomsEchoFlag && (
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
    </Theme>
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

  const showNewOnboarding = useFeatureFlag("AREnableNewOnboardingFlow")
  const userAccessToken = GlobalStore.useAppState((store) =>
    Platform.OS === "ios" && !showNewOnboarding
      ? store.native.sessionState.authenticationToken
      : store.auth.userAccessToken
  )

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
    <ProvideScreenTracking
      info={{
        context_screen: Schema.PageNames.Home,
        context_screen_owner_type: null as any,
      }}
    >
      {/* Avoid rendering when user is logged out, it will fail anyway */}
      {!!userAccessToken && (
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
                  ...Home_homePage @arguments(heroImageVersion: $heroImageVersion)
                }
                featured: viewingRooms(featured: true) @optionalField {
                  ...Home_featured
                }
                me @optionalField {
                  ...Home_me
                  ...AuctionResultsRail_me
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
                  homePage={below ? below.homePage : null}
                  me={below ? below.me : null}
                  featured={below ? below.featured : null}
                  homePageAbove={above.homePage}
                  meAbove={above.me}
                  loading={!below}
                />
              )
            },
            renderPlaceholder: () => <HomePlaceholder />,
          }}
          cacheConfig={{ force: true }}
          belowTheFoldTimeout={100}
        />
      )}
    </ProvideScreenTracking>
  )
}
