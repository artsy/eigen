import React from "react"
import { FlatList, RefreshControl, ScrollView, ViewProperties } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

import ArtistRail, { ArtistRail as ArtistRailType } from "lib/Components/Home/ArtistRails/ArtistRail"
import ArtworkCarousel, { ArtworkCarousel as ArtworkCarouselType } from "./Components/ArtworkCarousel"
import FairsRail, { FairsRail as FairsRailType } from "./Components/FairsRail"

import { ForYou_forYou } from "__generated__/ForYou_forYou.graphql"

interface Props extends ViewProperties {
  forYou: ForYou_forYou
}

interface State {
  rowData: Array<{
    type: "artwork" | "artist" | "fairs"
    data: any
  }>
  error?: string // TODO: Wire up to UI handler
  isRefreshing: boolean
}

type RailModule = ArtistRailType | FairsRailType | ArtworkCarouselType | null

export class ForYou extends React.Component<Props, State> {
  currentScrollOffset?: number = 0
  railModules: RailModule[] = []

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

    try {
      await Promise.all(this.railModules.map(railModule => railModule && railModule.refreshData()))

      setTimeout(() => {
        this.setState({
          isRefreshing: false,
        })
      }, 1000) // For consistent pull-to-refresh UI experience
    } catch (error) {
      console.error("ForYou/index.tsx - Error refreshing ForYou rails:", error.message)

      this.setState({
        error: error.message, // TODO: Display this somehow
      })
    }
  }

  /**
   * Can be used to register a mounting module or de-register an unmounting module by setting the index to `null`.
   */
  registerRailModule(index: number, railModule: RailModule) {
    this.railModules[index] = railModule
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
        renderItem={rowItem => {
          const { item: { data, type }, index } = rowItem
          const registerRailModule = this.registerRailModule.bind(this, index)

          switch (type) {
            case "artwork":
              return <ArtworkCarousel key={data.__id} rail={data} registerRailModule={registerRailModule} />
            case "artist":
              return <ArtistRail key={data.__id} rail={data} registerRailModule={registerRailModule} />
            case "fairs":
              return <FairsRail key={data.__id} fairs_module={data} registerRailModule={registerRailModule} />
          }
        }}
        keyExtractor={(item, index) => item.data.type + String(index)}
        style={{ overflow: "visible" }}
      />
    )
  }
}

export default createFragmentContainer(
  ForYou,
  graphql`
    fragment ForYou_forYou on HomePage {
      artwork_modules(
        max_rails: -1
        max_followed_gene_rails: -1
        order: [
          ACTIVE_BIDS
          RECOMMENDED_WORKS
          FOLLOWED_ARTISTS
          RELATED_ARTISTS
          FOLLOWED_GALLERIES
          SAVED_WORKS
          LIVE_AUCTIONS
          CURRENT_FAIRS
          FOLLOWED_GENES
          GENERIC_GENES
        ]
        exclude: [FOLLOWED_ARTISTS]
      ) {
        __id
        ...ArtworkCarousel_rail
      }
      artist_modules {
        __id
        ...ArtistRail_rail
      }
      fairs_module {
        ...FairsRail_fairs_module
      }
    }
  `
)
