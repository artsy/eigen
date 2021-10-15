import { Home_articlesConnection } from "__generated__/Home_articlesConnection.graphql"
import { Home_featured } from "__generated__/Home_featured.graphql"
import { Home_homePageAbove } from "__generated__/Home_homePageAbove.graphql"
import { Home_homePageBelow } from "__generated__/Home_homePageBelow.graphql"
import { Home_meAbove } from "__generated__/Home_meAbove.graphql"
import { Home_meBelow } from "__generated__/Home_meBelow.graphql"
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
import { compact, drop, times } from "lodash"
import { ArtsyLogoIcon, Box, Flex, Join, Spacer } from "palette"
import React, { createRef, RefObject, useEffect, useRef, useState } from "react"
import { Alert, RefreshControl, View, ViewProps } from "react-native"
import { _FragmentRefs, createRefetchContainer, graphql, RelayRefetchProp } from "react-relay"
import { ViewingRoomsHomeRail } from "../ViewingRoom/Components/ViewingRoomsHomeRail"
import { ArticlesRailFragmentContainer } from "./Components/ArticlesRail"
import { HomeExperiment } from "./Components/HomeExperiment"
import { HomeHeroContainer } from "./Components/HomeHero"
import { NewWorksForYouRailContainer } from "./Components/NewWorksForYouRail"
import { TroveFragmentContainer } from "./Components/Trove"
import { RailScrollRef } from "./Components/types"

interface Props extends ViewProps {
  articlesConnection: Home_articlesConnection | null
  featured: Home_featured | null
  homePageAbove: Home_homePageAbove | null
  homePageBelow: Home_homePageBelow | null
  loading: boolean
  meAbove: Home_meAbove | null
  meBelow: Home_meBelow | null
  relay: RelayRefetchProp
}

const Home = (props: Props) => {
  const { homePageAbove, homePageBelow, meAbove, meBelow, articlesConnection, featured, loading } = props
  const artworkModules = (homePageAbove?.artworkModules || []).concat(homePageBelow?.artworkModules || [])
  const salesModule = homePageAbove?.salesModule
  const collectionsModule = homePageBelow?.marketingCollectionsModule
  const artistModules = (homePageBelow?.artistModules && homePageBelow?.artistModules.concat()) || []
  const fairsModule = homePageBelow?.fairsModule

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
  const troveEchoFlag = useFeatureFlag("AREnableTrove")
  const showNewNewWorksForYouRail = useFeatureFlag("AREnableNewNewWorksForYou")

  /*
  Ordering is defined in https://www.notion.so/artsy/App-Home-Screen-4841255ded3f47c9bcdb73185ee3f335.
  Please make sure to keep this page in sync with the home screen.
  */

  const rowData = compact([
    // Above-the-fold modules (make sure to include enough modules in the above-the-fold query to cover the whole screen.)
    {
      type: "experiment",
    } as const,
    !!showNewNewWorksForYouRail && ({ type: "newWorksForYou" } as const),
    artworkRails[0],
    { type: "lotsByFollowedArtists" } as const,
    artworkRails[1],
    salesModule &&
      ({
        type: "sales",
        data: salesModule,
      } as const),
    // Below-the-fold modules
    enableAuctionResultsByFollowedArtists &&
      ({
        type: "auction-results",
      } as const),
    !!articlesConnection && ({ type: "articles" } as const),
    !!troveEchoFlag && ({ type: "trove" } as const),
    !!viewingRoomsEchoFlag && !!featured && ({ type: "viewing-rooms" } as const),
    collectionsModule &&
      ({
        type: "collections",
        data: collectionsModule,
      } as const),
    fairsModule &&
      ({
        type: "fairs",
        data: fairsModule,
      } as const),
    ...drop(artistRails, 1),
    ...drop(artworkRails, 2),
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
      <View style={{ flex: 1 }}>
        <AboveTheFoldFlatList
          data={rowData}
          initialNumToRender={5}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
          renderItem={({ item, index, separators }) => {
            switch (item.type) {
              case "experiment":
                return <HomeExperiment />

              case "articles":
                return articlesConnection ? (
                  <ArticlesRailFragmentContainer articlesConnection={articlesConnection} />
                ) : (
                  <></>
                )
              case "artwork":
                return (
                  <ArtworkRailFragmentContainer
                    rail={item.data}
                    scrollRef={scrollRefs.current[index]}
                    onShow={() => separators.updateProps("leading", { hideSeparator: false })}
                    onHide={() => separators.updateProps("leading", { hideSeparator: true })}
                  />
                )
              case "artist":
                return <ArtistRailFragmentContainer rail={item.data} scrollRef={scrollRefs.current[index]} />
              case "fairs":
                return <FairsRailFragmentContainer fairsModule={item.data} scrollRef={scrollRefs.current[index]} />
              case "sales":
                return (
                  <SalesRailFragmentContainer
                    salesModule={item.data}
                    scrollRef={scrollRefs.current[index]}
                    onShow={() => separators.updateProps("leading", { hideSeparator: false })}
                    onHide={() => separators.updateProps("leading", { hideSeparator: true })}
                  />
                )
              case "collections":
                return (
                  <CollectionsRailFragmentContainer
                    collectionsModule={item.data}
                    scrollRef={scrollRefs.current[index]}
                    onShow={() => separators.updateProps("leading", { hideSeparator: false })}
                  />
                )
              case "trove":
                return homePageBelow ? (
                  <TroveFragmentContainer
                    trove={homePageBelow}
                    onShow={() => separators.updateProps("trailing", { hideSeparator: false })}
                    onHide={() => separators.updateProps("trailing", { hideSeparator: true })}
                  />
                ) : (
                  <></>
                )
              case "viewing-rooms":
                return featured ? <ViewingRoomsHomeRail featured={featured} /> : <></>
              case "auction-results":
                return meBelow ? (
                  <AuctionResultsRailFragmentContainer
                    me={meBelow}
                    onShow={() => separators.updateProps("leading", { hideSeparator: false })}
                    onHide={() => separators.updateProps("leading", { hideSeparator: true })}
                  />
                ) : (
                  <></>
                )
              case "newWorksForYou":
                return meAbove ? (
                  <NewWorksForYouRailContainer me={meAbove} scrollRef={scrollRefs.current[index]} />
                ) : (
                  <></>
                )

              case "lotsByFollowedArtists":
                return meAbove ? (
                  <SaleArtworksHomeRailContainer
                    me={meAbove}
                    onShow={() => separators.updateProps("leading", { hideSeparator: false })}
                    onHide={() => separators.updateProps("leading", { hideSeparator: true })}
                  />
                ) : (
                  <></>
                )
            }
          }}
          ListHeaderComponent={
            <Box mb={1} mt={2}>
              <Flex alignItems="center">
                <ArtsyLogoIcon scale={0.75} />
              </Flex>
              <Spacer mb="15px" />
              {!!homePageAbove && <HomeHeroContainer homePage={homePageAbove} />}
              <Spacer mb="2" />
            </Box>
          }
          ItemSeparatorComponent={({ hideSeparator }) => (!hideSeparator ? <ModuleSeparator /> : null)}
          ListFooterComponent={() => <Flex mb={3}>{!!loading && <BelowTheFoldPlaceholder />}</Flex>}
          keyExtractor={(_item, index) => String(index)}
        />
        {!!meAbove && <EmailConfirmationBannerFragmentContainer me={meAbove} />}
      </View>
    </ProvideScreenTracking>
  )
}

export const HomeFragmentContainer = createRefetchContainer(
  Home,
  {
    // Make sure not to include modules that are part of "homePageBelow"
    homePageAbove: graphql`
      fragment Home_homePageAbove on HomePage
      @argumentDefinitions(heroImageVersion: { type: "HomePageHeroUnitImageVersion" }) {
        artworkModules(
          maxRails: -1
          maxFollowedGeneRails: -1
          order: [FOLLOWED_ARTISTS, ACTIVE_BIDS]
          include: [FOLLOWED_ARTISTS, ACTIVE_BIDS]
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
    homePageBelow: graphql`
      fragment Home_homePageBelow on HomePage
      @argumentDefinitions(heroImageVersion: { type: "HomePageHeroUnitImageVersion" }) {
        artworkModules(
          maxRails: -1
          maxFollowedGeneRails: -1
          order: [POPULAR_ARTISTS, RECENTLY_VIEWED_WORKS, SIMILAR_TO_RECENTLY_VIEWED]
          include: [POPULAR_ARTISTS, RECENTLY_VIEWED_WORKS, SIMILAR_TO_RECENTLY_VIEWED]
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

const BelowTheFoldPlaceholder: React.FC<{}> = () => {
  const viewingRoomsEchoFlag = useFeatureFlag("AREnableViewingRooms")

  return (
    <ProvidePlaceholderContext>
      <Flex>
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
  const viewingRoomsEchoFlag = useFeatureFlag("AREnableViewingRooms")

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
