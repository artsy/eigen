import React from "react"
import { FlatList, RefreshControl, ScrollView, ViewProperties } from "react-native"
import { createRefetchContainer, graphql, RelayRefetchProp } from "react-relay"

import ArtistRail from "lib/Components/Home/ArtistRails/ArtistRail"
import ArtworkCarousel from "./Components/ArtworkCarousel"
import FairsRail from "./Components/FairsRail"

import { ForYou_forYou } from "__generated__/ForYou_forYou.graphql"

interface Props extends ViewProperties {
  forYou: ForYou_forYou
  relay: RelayRefetchProp
}

interface State {
  rowData: Array<{
    type: "artwork" | "artist" | "fairs"
    data: any
  }>
  isRefreshing: boolean
}

export class ForYou extends React.Component<Props, State> {
  currentScrollOffset?: number = 0

  state = {
    isRefreshing: false,
    rowData: [],
  }

  componentDidMount() {
    const { forYou } = this.props
    const rowData = []
    const artworkModules = forYou.artwork_modules || []
    const artistModules = forYou.artist_modules && forYou.artist_modules.concat()
    const fairsModule = forYou.fairs_module

    rowData.push({
      type: "fairs",
      data: fairsModule,
    })

    artworkModules.forEach((artworkModule, index) => {
      rowData.push({
        type: "artwork",
        data: artworkModule,
      })

      const alternateRow = (index + 1) % 2 === 0

      if (alternateRow) {
        const artistModule = artistModules.shift()
        if (artistModule) {
          rowData.push({
            type: "artist",
            data: artistModule,
          })
        }
      }
    })

    this.setState({
      rowData,
    })
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
    return (
      <FlatList
        data={this.state.rowData}
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
        renderItem={({ item: { data, type } }) => {
          switch (type) {
            case "artwork":
              return <ArtworkCarousel key={data.id} rail={data} />
            case "artist":
              return <ArtistRail key={data.id} rail={data} />
            case "fairs":
              return <FairsRail key={data.id} fairs_module={data} />
          }
        }}
        keyExtractor={(item, index) => item.data.type + String(index)}
        style={{ overflow: "visible" }}
      />
    )
  }
}

export default createRefetchContainer(
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
