import { Home_articlesConnection } from "__generated__/Home_articlesConnection.graphql"
import { Home_featured } from "__generated__/Home_featured.graphql"
import { Home_homePage } from "__generated__/Home_homePage.graphql"
import { Home_me } from "__generated__/Home_me.graphql"
import { HomeQuery } from "__generated__/HomeQuery.graphql"
import { AboveTheFoldFlatList } from "lib/Components/AboveTheFoldFlatList"
import { ArtistRailFragmentContainer } from "lib/Components/Home/ArtistRails/ArtistRail"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { ArtworkRailFragmentContainer } from "lib/Scenes/Home/Components/ArtworkRail"
import { CollectionsRailFragmentContainer } from "lib/Scenes/Home/Components/CollectionsRail"
import { EmailConfirmationBannerFragmentContainer } from "lib/Scenes/Home/Components/EmailConfirmationBanner"
import { FairsRailFragmentContainer } from "lib/Scenes/Home/Components/FairsRail"
import { SaleArtworksHomeRailContainer } from "lib/Scenes/Home/Components/SaleArtworksHomeRail"
import { SalesRailFragmentContainer } from "lib/Scenes/Home/Components/SalesRail"
import { GlobalStore, useFeatureFlag } from "lib/store/GlobalStore"
import { isPad } from "lib/utils/hardware"
import { PlaceholderBox, PlaceholderText } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { ProvideScreenTracking, Schema } from "lib/utils/track"
import { compact, drop, flatten, times, zip } from "lodash"
import { ArtsyLogoIcon, Box, Flex, Join, Spacer, Theme } from "palette"
import React, { createRef, RefObject, useEffect, useRef, useState } from "react"
import { Alert, Platform, RefreshControl, View, ViewProps } from "react-native"
import { createRefetchContainer, graphql, QueryRenderer, RelayRefetchProp } from "react-relay"
import { ViewingRoomsHomeRail } from "../ViewingRoom/Components/ViewingRoomsHomeRail"
import { ArticlesRailFragmentContainer } from "./Components/ArticlesRail"
import { HomeHeroContainer } from "./Components/HomeHero"
import { RailScrollRef } from "./Components/types"

interface Props extends ViewProps {
  articlesConnection: Home_articlesConnection
  homePage: Home_homePage
  me: Home_me
  featured: Home_featured
  relay: RelayRefetchProp
}

const Home = (props: Props) => {
  const { articlesConnection, homePage, me, featured } = props
  const artworkModules = homePage.artworkModules || []
  const salesModule = homePage.salesModule
  const collectionsModule = homePage.marketingCollectionsModule
  const artistModules = (homePage.artistModules && homePage.artistModules.concat()) || []
  const fairsModule = homePage.fairsModule

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
  Please make sure to keep this page in sync with the home screen.
  */
  const rowData = compact([
    { type: "articles" } as const,
    artworkRails[0],
    { type: "lotsByFollowedArtists" } as const,
    artworkRails[1],
    salesModule &&
      ({
        type: "sales",
        data: salesModule,
      } as const),
    !!viewingRoomsEchoFlag && ({ type: "viewing-rooms" } as const),
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
    homePage: graphql`
      fragment Home_homePage on HomePage
      @argumentDefinitions(heroImageVersion: { type: "HomePageHeroUnitImageVersion" }) {
        artworkModules(
          maxRails: -1
          maxFollowedGeneRails: -1
          order: [ACTIVE_BIDS, FOLLOWED_ARTISTS, RECENTLY_VIEWED_WORKS, RECOMMENDED_WORKS, FOLLOWED_GALLERIES]
          # LIVE_AUCTIONS and CURRENT_FAIRS both have their own modules, below.
          exclude: [SAVED_WORKS, GENERIC_GENES, LIVE_AUCTIONS, CURRENT_FAIRS, RELATED_ARTISTS, FOLLOWED_GENES]
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
        salesModule {
          ...SalesRail_salesModule
        }
        marketingCollectionsModule {
          ...CollectionsRail_collectionsModule
        }
        ...HomeHero_homePage @arguments(heroImageVersion: $heroImageVersion)
      }
    `,
    me: graphql`
      fragment Home_me on Me {
        ...EmailConfirmationBanner_me
        ...SaleArtworksHomeRail_me
      }
    `,
    featured: graphql`
      fragment Home_featured on ViewingRoomConnection {
        ...ViewingRoomsListFeatured_featured
      }
    `,
    articlesConnection: graphql`
      fragment Home_articlesConnection on ArticleConnection {
        ...ArticlesRail_articlesConnection
      }
    `,
  },
  graphql`
    query HomeRefetchQuery($heroImageVersion: HomePageHeroUnitImageVersion!) {
      articlesConnection(first: 10, sort: PUBLISHED_AT_DESC, inEditorialFeed: true) {
        ...Home_articlesConnection
      }
      homePage {
        ...Home_homePage @arguments(heroImageVersion: $heroImageVersion)
      }
      me {
        ...Home_me
      }
      featured: viewingRooms(featured: true) {
        ...Home_featured
      }
    }
  `
)

const HomePlaceholder: React.FC<{}> = () => {
  // We use Math.random() here instead of PlaceholderRaggedText because its random
  // length is too deterministic, and we don't have any snapshot tests to worry about.

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
              <PlaceholderText width={100 + Math.random() * 100} />
              <Flex flexDirection="row" mt={1}>
                <Join separator={<Spacer width={15} />}>
                  {times(3 + Math.random() * 10).map((index) => (
                    <Flex key={index}>
                      <PlaceholderBox height={120} width={120} />
                      <Spacer mb={2} />
                      <PlaceholderText width={120} />
                      <PlaceholderText width={30 + Math.random() * 60} />
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
          <PlaceholderText width={100 + Math.random() * 100} />
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
            <PlaceholderText width={100 + Math.random() * 100} marginBottom={20} />
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

  const userAccessToken = GlobalStore.useAppState((store) =>
    Platform.OS === "ios" ? store.native.sessionState.authenticationToken : store.auth.userAccessToken
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

  // Avoid rendering when user is logged out, it will fail anyway
  return userAccessToken ? (
    <QueryRenderer<HomeQuery>
      environment={defaultEnvironment}
      query={graphql`
        query HomeQuery($heroImageVersion: HomePageHeroUnitImageVersion) {
          homePage {
            ...Home_homePage @arguments(heroImageVersion: $heroImageVersion)
          }
          me {
            ...Home_me
          }
          featured: viewingRooms(featured: true) {
            ...Home_featured
          }
          articlesConnection(first: 10, sort: PUBLISHED_AT_DESC, inEditorialFeed: true) {
            ...Home_articlesConnection
          }
        }
      `}
      variables={{ heroImageVersion: isPad() ? "WIDE" : "NARROW" }}
      render={renderWithPlaceholder({ Container: HomeFragmentContainer, renderPlaceholder: () => <HomePlaceholder /> })}
      cacheConfig={{ force: true }}
    />
  ) : null
}
