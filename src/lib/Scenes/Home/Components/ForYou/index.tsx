import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

import { ListView, ListViewDataSource, RefreshControl, ScrollView, ScrollViewProps, ViewProperties } from "react-native"

import ArtistRail from "lib/Components/Home/ArtistRails/ArtistRail"
import ArtworkCarousel from "./Components/ArtworkCarousel"
import FairsRail from "./Components/FairsRail"

interface DataSourceRow {
  type: "artwork" | "artist" | "fairs"
  data: any
}

interface State {
  modules: any[]
  isRefreshing: boolean
  dataSource: ListViewDataSource
}

export class ForYou extends React.Component<any, State> {
  listView?: ListView | any
  currentScrollOffset?: number = 0

  constructor(props) {
    super(props)

    const dataSource: ListViewDataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

    this.state = {
      isRefreshing: false,
      modules: [],
      dataSource,
    }
  }

  componentDidMount() {
    const rows: DataSourceRow[] = []
    const artworkModules = this.props.forYou.artwork_modules || []
    const artistModules = this.props.forYou.artist_modules && this.props.forYou.artist_modules.concat()
    const fairsModule = this.props.forYou.fairs_module
    rows.push({ type: "fairs", data: fairsModule })
    for (let i = 0; i < artworkModules.length; i++) {
      const artworkModule = artworkModules[i]
      rows.push({ type: "artwork", data: artworkModule })
      if ((i + 1) % 2 === 0) {
        const artistModule = artistModules.shift()
        if (artistModule) {
          rows.push({ type: "artist", data: artistModule })
        }
      }
    }
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(rows),
    })
  }

  handleRefresh = () => {
    this.setState({ isRefreshing: true })
    const stopRefreshing = () => this.setState({ isRefreshing: false })

    Promise.all(
      this.state.modules.map(module => {
        return new Promise((resolve, reject) => {
          module.forceFetch(null, readyState => {
            if (readyState.error) {
              reject(readyState.error)
            } else if (readyState.aborted) {
              reject()
            } else if (readyState.done) {
              resolve()
            }
          })
        })
      })
    ).then(stopRefreshing, stopRefreshing)
  }

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderScrollComponent={(props: ScrollViewProps) => {
          const refreshControl = <RefreshControl refreshing={this.state.isRefreshing} onRefresh={this.handleRefresh} />
          return <ScrollView {...props} automaticallyAdjustContentInsets={false} refreshControl={refreshControl} />
        }}
        renderRow={({ type, data }, _, row: number) => {
          // Offset row because we don’t store a reference to the search bar and hero units rows.
          const registerModule = module => (this.state.modules[row - 2] = module)
          switch (type) {
            case "artwork":
              return <ArtworkCarousel ref={registerModule} key={data.__id} rail={data} />
            case "artist":
              return <ArtistRail ref={registerModule} key={data.__id} rail={data} />
            case "fairs":
              return <FairsRail fairs_module={data} />
          }
        }}
        onScroll={event => (this.currentScrollOffset = event.nativeEvent.contentOffset.y)}
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
