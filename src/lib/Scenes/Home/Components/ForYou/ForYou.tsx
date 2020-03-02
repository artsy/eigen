import React from "react"
import { FlatList, RefreshControl, ScrollView, ViewProperties } from "react-native"
import { createRefetchContainer, graphql, RelayRefetchProp } from "react-relay"

import ArtistRail from "lib/Components/Home/ArtistRails/ArtistRail"
import ArtworkCarousel from "./Components/ArtworkCarousel"
import FairsRail from "./Components/FairsRail"

import { ForYou_forYou } from "__generated__/ForYou_forYou.graphql"
import { compact, flatten, zip } from "lodash"

interface Props extends ViewProperties {
  forYou: ForYou_forYou
  relay: RelayRefetchProp
}

interface State {
  isRefreshing: boolean
}

export class ForYou extends React.Component<Props, State> {
  currentScrollOffset?: number = 0

  state = {
    isRefreshing: false,
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
    const { forYou } = this.props
    const artworkModules = forYou.artwork_modules || []
    const artistModules = forYou.artist_modules && forYou.artist_modules.concat()
    const fairsModule = forYou.fairs_module

    const interleavedArtworkArtists = compact(
      flatten(
        zip(
          artistModules.map(
            module =>
              ({
                type: "artist",
                data: module,
              } as const)
          ),
          artworkModules.map(
            module =>
              ({
                type: "artwork",
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
      ...interleavedArtworkArtists,
    ]

    return (
      <FlatList
        data={rowData}
        renderScrollComponent={props => {
          return (
            <ScrollView
              {...props}
              removeClippedSubviews={true}
              automaticallyAdjustContentInsets={false}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.isRefreshing}
                  onRefresh={this.handleRefresh}
                  style={{ marginBottom: 18 }}
                />
              }
            />
          )
        }}
        renderItem={({ item }) => {
          switch (item.type) {
            case "artwork":
              return <ArtworkCarousel rail={item.data} />
            case "artist":
              return <ArtistRail rail={item.data} />
            case "fairs":
              return <FairsRail fairs_module={item.data} />
          }
        }}
        keyExtractor={(_item, index) => String(index)}
        style={{ overflow: "visible" }}
      />
    )
  }
}

export const ForYouFragmentContainer = createRefetchContainer(
  ForYou,
  {
    forYou: graphql`
      fragment ForYou_forYou on HomePage {
        artwork_modules: artworkModules(
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
            LIVE_AUCTIONS
            CURRENT_FAIRS
            FOLLOWED_GENES
          ]
          exclude: [FOLLOWED_ARTISTS, GENERIC_GENES]
        ) {
          id
          ...ArtworkCarousel_rail
        }
        artist_modules: artistModules {
          id
          ...ArtistRail_rail
        }
        fairs_module: fairsModule {
          ...FairsRail_fairs_module
        }
      }
    `,
  },
  graphql`
    query ForYouRefetchQuery {
      forYou: homePage {
        ...ForYou_forYou
      }
    }
  `
)
