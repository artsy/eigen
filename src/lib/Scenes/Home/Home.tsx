import React from "react"
import { RefreshControl, View, ViewProperties } from "react-native"
import { createRefetchContainer, graphql, QueryRenderer, RelayRefetchProp } from "react-relay"

import { ArtistRailFragmentContainer } from "lib/Components/Home/ArtistRails/ArtistRail"
import { ArtworkRailFragmentContainer } from "lib/Scenes/Home/Components/ArtworkRail"
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
import { Schema, screenTrack } from "lib/utils/track"

interface Props extends ViewProperties {
  homePage: Home_homePage
  relay: RelayRefetchProp
}

interface State {
  isRefreshing: boolean
}

@screenTrack(() => ({
  context_screen: Schema.PageNames.Home,
  context_screen_owner_type: null,
}))
export class Home extends React.Component<Props, State> {
  state: State = {
    isRefreshing: false,
  }

  handleRefresh = async () => {
    this.setState({ isRefreshing: true })

    this.props.relay.refetch(
      {},
      {},
      error => {
        if (error) {
          console.error("Home.tsx - Error refreshing ForYou rails:", error.message)
        }
        this.setState({ isRefreshing: false })
      },
      { force: true }
    )
  }

  render() {
    const { homePage } = this.props
    const artworkModules = homePage.artworkModules || []
    const salesModule = homePage.salesModule
    const artistModules = homePage.artistModules && homePage.artistModules.concat()
    const fairsModule = homePage.fairsModule

    const artworkRails = artworkModules.map(
      module =>
        ({
          type: "artwork",
          data: module,
        } as const)
    )
    const artistRails = artistModules.map(
      module =>
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
    - Fairs                           -> fairsModule
    - Recommended works for you       -> artworksModule
    - Recommended artists to follow   -> artistModules
    - Similar to works you’ve saved   -> artworksModule
    - Similar to works you’ve viewed  -> okay so it gets complicated from here on out
    - Works from galleries you follow -> so let's just zip() and hope for the best.
    - Trending artists to follow
    */

    const rowData = [
      ...take(artworkRails, 3),
      {
        type: "sales",
        data: salesModule,
      } as const,
      {
        type: "fairs",
        data: fairsModule,
      } as const,
      ...compact(flatten(zip(drop(artworkRails, 3), artistRails))),
    ]

    return (
      <Theme>
        <View style={{ flex: 1 }}>
          <Box mb={1} mt={2}>
            <Flex alignItems="center">
              <ArtsyLogoIcon scale={0.75} />
            </Flex>
          </Box>
          <Separator />
          <AboveTheFoldFlatList
            data={rowData}
            initialNumToRender={5}
            refreshControl={<RefreshControl refreshing={this.state.isRefreshing} onRefresh={this.handleRefresh} />}
            renderItem={({ item }) => {
              switch (item.type) {
                case "artwork":
                  return <ArtworkRailFragmentContainer rail={item.data} />
                case "artist":
                  return <ArtistRailFragmentContainer rail={item.data} />
                case "fairs":
                  return <FairsRailFragmentContainer fairsModule={item.data} />
                case "sales":
                  return <SalesRailFragmentContainer salesModule={item.data} />
              }
            }}
            ListFooterComponent={() => <Spacer mb={3} />}
            keyExtractor={(_item, index) => String(index)}
          />
          <DarkNavigationButton
            title="Sell works from your collection through Artsy"
            onPress={() => SwitchBoard.presentNavigationViewController(this, Router.ConsignmentsStartSubmission)}
          />
        </View>
      </Theme>
    )
  }
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
            FOLLOWED_GENES
          ]
          # LIVE_AUCTIONS and CURRENT_FAIRS both have their own modules, below.
          exclude: [GENERIC_GENES, LIVE_AUCTIONS, CURRENT_FAIRS, RELATED_ARTISTS]
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
        {times(5).map(r => (
          <Box key={r} ml={2} mr={2}>
            <Spacer mb={3} />
            <PlaceholderText width={100 + Math.random() * 100} />
            <Flex flexDirection="row" mt={1}>
              <Join separator={<Spacer ml={0.5} />}>
                {times(5).map(index => (
                  <PlaceholderBox key={index} height={100} width={100} />
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
