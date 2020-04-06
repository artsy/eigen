import React from "react"
import { FlatList, RefreshControl, View, ViewProperties } from "react-native"
import { createRefetchContainer, graphql, QueryRenderer, RelayRefetchProp } from "react-relay"

import { ArtistRailFragmentContainer } from "lib/Components/Home/ArtistRails/ArtistRail"
import { ArtworkRailFragmentContainer } from "lib/Scenes/Home/Components/ArtworkRail"
import { FairsRailFragmentContainer } from "lib/Scenes/Home/Components/FairsRail"
import { SalesRailFragmentContainer } from "lib/Scenes/Home/Components/SalesRail"

import { ArtsyLogoIcon, Box, Flex, Separator, Spacer, Theme } from "@artsy/palette"
import { Home_homePage } from "__generated__/Home_homePage.graphql"
import { HomeQuery } from "__generated__/HomeQuery.graphql"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { compact, flatten, zip } from "lodash"

import DarkNavigationButton from "lib/Components/Buttons/DarkNavigationButton"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { Router } from "lib/utils/router"
import { Schema, screenTrack } from "lib/utils/track"

interface Props extends ViewProperties {
  homePage: Home_homePage
  relay: RelayRefetchProp
}

interface State {
  isRefreshing: boolean
  userHasScrolled: boolean
}

@screenTrack(() => ({
  context_screen: Schema.PageNames.Home,
  context_screen_owner_type: null,
}))
export class Home extends React.Component<Props, State> {
  state: State = {
    isRefreshing: false,
    userHasScrolled: false,
  }

  handleRefresh = async () => {
    this.setState({ isRefreshing: true })

    this.props.relay.refetch(
      {},
      {},
      error => {
        if (error) {
          console.error("ForYou/index.tsx - Error refreshing ForYou rails:", error.message)
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

    const interleavedArtworkArtists = compact(
      flatten(
        zip(
          artworkModules.map(
            module =>
              ({
                type: "artwork",
                data: module,
              } as const)
          ),
          artistModules.map(
            module =>
              ({
                type: "artist",
                data: module,
              } as const)
          )
        )
      )
    )

    const rowData = [
      {
        type: "fairs",
        data: fairsModule,
      } as const,
      {
        type: "sales",
        data: salesModule,
      } as const,
      ...interleavedArtworkArtists,
    ]

    return (
      <Theme>
        <View style={{ flex: 1 }}>
          <FlatList
            data={rowData}
            initialNumToRender={5}
            windowSize={this.state.userHasScrolled ? 4 : 1}
            onScrollBeginDrag={() => this.setState({ userHasScrolled: true })}
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
            ListHeaderComponent={
              <View>
                <Box mb={1} mt={2}>
                  <Flex alignItems="center">
                    <ArtsyLogoIcon scale={0.75} />
                  </Flex>
                </Box>
                <Separator />
              </View>
            }
            ListFooterComponent={() => <Spacer mb={3} />}
            keyExtractor={(_item, index) => String(index)}
            style={{ overflow: "visible" }}
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
            RECENTLY_VIEWED_WORKS
            RECOMMENDED_WORKS
            FOLLOWED_ARTISTS
            RELATED_ARTISTS
            FOLLOWED_GALLERIES
            SAVED_WORKS
            CURRENT_FAIRS
            FOLLOWED_GENES
          ]
          exclude: [GENERIC_GENES, LIVE_AUCTIONS]
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
      render={renderWithLoadProgress(HomeFragmentContainer)}
    />
  )
}
