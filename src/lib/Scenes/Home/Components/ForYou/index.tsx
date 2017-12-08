import React from "react"
import { createFragmentContainer, graphql, RelayRefetchProp } from "react-relay"

import { FlatList, ListView, RefreshControl, ScrollView, ViewProperties } from "react-native"

import ArtistRail, { ArtistRail as ArtistRailType } from "lib/Components/Home/ArtistRails/ArtistRail"
import ArtworkCarousel, { ArtworkCarousel as ArtworkCarouselType } from "./Components/ArtworkCarousel"
import FairsRail, { FairsRail as FairsRailType } from "./Components/FairsRail"

interface State {
  rowData: Array<{
    type: "artwork" | "artist" | "fairs"
    data: any
  }>
  error?: string // TODO: Wire up to UI handler
  isRefreshing: boolean
}

type RailModule = ArtistRailType | FairsRailType | ArtworkCarouselType

export class ForYou extends React.Component<ViewProperties & RelayProps, State> {
  listView?: ListView | any
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
      await Promise.all(
        this.railModules.map(railModule => {
          railModule.refreshData()
        })
      )

      this.setState({
        isRefreshing: false,
      })
    } catch (error) {
      console.error("ForYou/index.tsx", error.message)

      this.setState({
        error: error.message, // TODO: Display this somehow
      })
    }
  }

  registerRailModule = row => {
    return railModule => {
      this.railModules[row - 2] = railModule // Offset row because we don’t store a reference to the search bar and hero units rows.
    }
  }

  render() {
    return (
      <FlatList
        data={this.state.rowData}
        renderScrollComponent={props => {
          return (
            <ScrollView
              {...props}
              automaticallyAdjustContentInsets={false}
              refreshControl={<RefreshControl refreshing={this.state.isRefreshing} onRefresh={this.handleRefresh} />}
            />
          )
        }}
        renderItem={rowItem => {
          const { item: { data, type }, index } = rowItem

          switch (type) {
            case "artwork":
              return <ArtworkCarousel key={data.__id} rail={data} registerRailModule={this.registerRailModule(index)} />
            case "artist":
              return <ArtistRail key={data.__id} rail={data} registerRailModule={this.registerRailModule(index)} />
            case "fairs":
              return <FairsRail fairs_module={data} registerRailModule={this.registerRailModule(index)} />
          }
        }}
        keyExtractor={(item, index) => item.data.type + String(index)}
        ref={listView => (this.listView = listView)}
        style={{ marginTop: 20, overflow: "visible" }}
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

interface RelayProps {
  forYou: {
    artwork_modules: Array<{
      __id: string
    } | null> | null
    artist_modules: Array<{
      __id: string
    } | null> | null
    fairs_module: any | null
  }
}
