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

type Props = ViewProperties & RelayProps

interface State {
  dataSource: ListViewDataSource
  errors?: string // TODO: Wire up to UI handler
  isRefreshing: boolean
}

interface Module {
  props: {
    rail: any
    relay: RelayProps
  }
  state: any
}

export class ForYou extends React.Component<Props, State> {
  listView?: ListView | any
  currentScrollOffset?: number = 0
  modules: Module[] = []

  constructor(props) {
    super(props)

    const dataSource: ListViewDataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    })

    this.state = {
      isRefreshing: false,
      dataSource,
    }
  }

  componentDidMount() {
    const { forYou } = this.props
    const rows: DataSourceRow[] = []
    const artworkModules = forYou.artwork_modules || []
    const artistModules = forYou.artist_modules && forYou.artist_modules.concat()
    const fairsModule = forYou.fairs_module

    rows.push({
      type: "fairs",
      data: fairsModule,
    })

    artworkModules.forEach((artworkModule, index) => {
      rows.push({
        type: "artwork",
        data: artworkModule,
      })

      const alternateRow = (index + 1) % 2 === 0

      if (alternateRow) {
        const artistModule = artistModules.shift()
        if (artistModule) {
          rows.push({
            type: "artist",
            data: artistModule,
          })
        }
      }
    })

    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(rows),
    })
  }

  handleRefresh = async () => {
    this.setState({
      isRefreshing: true,
    })

    try {
      await Promise.all(
        this.modules.map(module => {
          return new Promise((resolve, reject) => {
            const { props, state: { data, relayProp } } = module

            relayProp.refetch({ ...props.rail, fetchContent: true }, null, error => {
              if (error) {
                console.error("Home/ForYou | ", error)
                reject(error)
              } else {
                resolve()
              }
            })
          })
        })
      )

      // Success
      this.setState({
        isRefreshing: false,
      })

      // Fail
    } catch (errors) {
      this.setState({
        errors, // TODO: Display this somehow
      })
    }
  }

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderScrollComponent={props => {
          return (
            <ScrollView
              {...props}
              automaticallyAdjustContentInsets={false}
              refreshControl={<RefreshControl refreshing={this.state.isRefreshing} onRefresh={this.handleRefresh} />}
            />
          )
        }}
        renderRow={({ type, data }, _, row: number) => {
          const registerModule = module => {
            // Offset row because we don’t store a reference to the search bar and hero units rows.
            // FIXME: Don't mutate state
            this.modules[row - 2] = module
          }

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
