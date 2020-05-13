import React, { createRef, RefObject, useRef, useState } from "react"
import { RefreshControl, View, ViewProperties } from "react-native"
import { createRefetchContainer, graphql, QueryRenderer, RelayRefetchProp } from "react-relay"

import { ArtistRailFragmentContainer } from "lib/Components/Home/ArtistRails/ArtistRail"
import { ArtworkRailFragmentContainer } from "lib/Scenes/Home/Components/ArtworkRail"
import { CollectionsRailFragmentContainer } from "lib/Scenes/Home/Components/CollectionsRail"
import { FairsRailFragmentContainer } from "lib/Scenes/Home/Components/FairsRail"
import { SalesRailFragmentContainer } from "lib/Scenes/Home/Components/SalesRail"

import { ArtsyLogoIcon, Box, Flex, Join, Separator, Spacer, Theme } from "@artsy/palette"
import { Home_homePage } from "__generated__/Home_homePage.graphql"
import { HomeQuery } from "__generated__/HomeQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { compact, drop, flatten, take, times, zip } from "lodash"

import { AboveTheFoldFlatList } from "lib/Components/AboveTheFoldFlatList"
import DarkNavigationButton from "lib/Components/Buttons/DarkNavigationButton"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { PlaceholderBox, PlaceholderText } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { Router } from "lib/utils/router"
import { ProvideScreenTracking, Schema } from "lib/utils/track"
import { RailScrollRef } from "./Components/types"

interface Props extends ViewProperties {
  homePage: Home_homePage
  relay: RelayRefetchProp
}

const Home = (props: Props) => {
  const navRef = useRef<any>()

  const { homePage } = props
  const artworkModules = homePage.artworkModules || []
  const salesModule = homePage.salesModule
  const collectionsModule = homePage.marketingCollectionsModule
  const artistModules = (homePage.artistModules && homePage.artistModules.concat()) || []
  const fairsModule = homePage.fairsModule

  const artworkRails = artworkModules.map(
    module =>
      module &&
      ({
        type: "artwork",
        data: module,
      } as const)
  )
  const artistRails = artistModules.map(
    module =>
      module &&
      ({
        type: "artist",
        data: module,
      } as const)
  )

  /*
  Ordering is defined in https://artsyproduct.atlassian.net/browse/MX-193 but here's a rough mapping:
  - New works for you               -> artworksModule
  - Recently viewed                 -> artworksModule
  - Recently saved                  -> artworksModule
  - Auctions                        -> salesModule
  - Collections                     -> marketingCollectionsModule
  - Fairs                           -> fairsModule
  - Recommended works for you       -> artworksModule
  - Recommended artists to follow   -> artistModules
  - Similar to works you’ve saved   -> artworksModule
  - Similar to works you’ve viewed  -> okay so it gets complicated from here on out
  - Works from galleries you follow -> so let's just zip() and hope for the best.
  - Trending artists to follow
  */

  const rowData = compact([
    ...take(artworkRails, 3),
    salesModule &&
      ({
        type: "sales",
        data: salesModule,
      } as const),
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
    ...flatten(zip(drop(artworkRails, 3), artistRails)),
  ])

  const scrollRefs = useRef<Array<RefObject<RailScrollRef>>>(rowData.map(_ => createRef()))
  const scrollRailsToTop = () => scrollRefs.current.forEach(r => r.current?.scrollToTop())

  const [isRefreshing, setIsRefreshing] = useState(false)
  const handleRefresh = async () => {
    setIsRefreshing(true)

    props.relay.refetch(
      {},
      {},
      error => {
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
        context_screen_owner_type: null as any /* STRICTNESS_MIGRATION */,
      }}
    >
      <Theme>
        <View ref={navRef} style={{ flex: 1 }}>
          <Box mb={1} mt={2}>
            <Flex alignItems="center">
              <ArtsyLogoIcon scale={0.75} />
            </Flex>
          </Box>
          <Separator />
          <AboveTheFoldFlatList
            data={rowData}
            initialNumToRender={5}
            refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
            renderItem={({ item, index }) => {
              switch (item.type) {
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
                      componentRef={scrollRefs.current[index]}
                    />
                  )
              }
            }}
            ListFooterComponent={() => <Spacer mb={3} />}
            keyExtractor={(_item, index) => String(index)}
          />
          <DarkNavigationButton
            title="Sell works from your collection through Artsy"
            onPress={() =>
              SwitchBoard.presentNavigationViewController(navRef.current, Router.ConsignmentsStartSubmission)
            }
          />
        </View>
      </Theme>
    </ProvideScreenTracking>
  )
}

export const HomeFragmentContainer = createRefetchContainer(
  Home,
  {
    homePage: graphql`
      fragment Home_homePage on HomePage {
        artworkModules(
          maxRails: -1
          maxFollowedGeneRails: -1
          order: [
            ACTIVE_BIDS
            FOLLOWED_ARTISTS
            RECENTLY_VIEWED_WORKS
            SAVED_WORKS
            RECOMMENDED_WORKS
            FOLLOWED_GALLERIES
          ]
          # LIVE_AUCTIONS and CURRENT_FAIRS both have their own modules, below.
          exclude: [GENERIC_GENES, LIVE_AUCTIONS, CURRENT_FAIRS, RELATED_ARTISTS, FOLLOWED_GENES]
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
      }
    `,
  },
  graphql`
    query HomeRefetchQuery {
      homePage {
        ...Home_homePage
      }
    }
  `
)

const HomePlaceholder: React.FC<{}> = () => {
  // We use Math.random() here instead of PlaceholderRaggedText because its random
  // length is too deterministic, and we don't have any snapshot tests to worry about.
  return (
    <Theme>
      <Flex>
        <Box mb={1} mt={2}>
          <Flex alignItems="center">
            <ArtsyLogoIcon scale={0.75} />
          </Flex>
        </Box>
        <Separator />
        {// Small tiles to mimic the artwork rails
        times(3).map(r => (
          <Box key={r} ml={2} mr={2}>
            <Spacer mb={3} />
            <PlaceholderText width={100 + Math.random() * 100} />
            <Flex flexDirection="row" mt={1}>
              <Join separator={<Spacer width={15} />}>
                {times(3 + Math.random() * 10).map(index => (
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
        ))}
        {// Larger tiles to mimic the fairs, sales, and collections rails
        times(3).map(r => (
          <Box key={r} ml={2} mr={2}>
            <Spacer mb={3} />
            <PlaceholderText width={100 + Math.random() * 100} />
            <Flex flexDirection="row" mt={1}>
              <Join separator={<Spacer width={15} />}>
                {times(10).map(index => (
                  <PlaceholderBox key={index} height={270} width={270} />
                ))}
              </Join>
              <Spacer mb={2} />
            </Flex>
          </Box>
        ))}
      </Flex>
    </Theme>
  )
}

export const HomeRenderer: React.SFC = () => {
  return (
    <QueryRenderer<HomeQuery>
      environment={defaultEnvironment}
      query={graphql`
        query HomeQuery {
          homePage {
            ...Home_homePage
          }
        }
      `}
      variables={{}}
      render={renderWithPlaceholder({ Container: HomeFragmentContainer, renderPlaceholder: () => <HomePlaceholder /> })}
    />
  )
}
