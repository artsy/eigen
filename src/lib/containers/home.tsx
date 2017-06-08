import * as React from "react"
import * as Relay from "react-relay"

import { ListView, ListViewDataSource, RefreshControl, ScrollView, ScrollViewProps, ViewProperties } from "react-native"

import ArtistRail from "../components/home/artist_rails/artist_rail"
import ArtworkRail from "../components/home/artwork_rails/artwork_rail"
import HeroUnits from "../components/home/hero_units"
import SearchBar from "../components/home/search_bar"

interface DataSourceRow {
  type: "search_bar" | "hero_units" | "artwork" | "artist"
  data: any
}

interface Props extends ViewProperties, RelayProps {
  trigger1pxScrollHack?: boolean
}

interface State {
  modules: any[]
  isRefreshing: boolean
  dataSource: ListViewDataSource
}

export class Home extends React.Component<Props, State> {
  // TODO: This `| any` is a hack workaround to a typing bug in https://github.com/artsy/emission/pull/504/
  listView?: ListView | any
  currentScrollOffset?: number = 0

  constructor(props) {
    super(props)

    const rows: DataSourceRow[] = [
      { type: "search_bar", data: null },
      { type: "hero_units", data: this.props.home.hero_units },
    ]
    const artworkModules = this.props.home.artwork_modules
    // create a copy so we can mutate it (with `shift`)
    const artistModules = this.props.home.artist_modules && this.props.home.artist_modules.concat()

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

    const dataSource: ListViewDataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

    this.state = {
      isRefreshing: false,
      modules: [],
      dataSource: dataSource.cloneWithRows(rows),
    }
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

  componentDidUpdate(previousProps: Props) {
    const didTrigger1pxScrollHack =
      !!previousProps.trigger1pxScrollHack === false && this.props.trigger1pxScrollHack === true
    if (didTrigger1pxScrollHack) {
      this.listView.scrollTo({ y: this.currentScrollOffset + 1, animated: false })
    }
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
            case "search_bar":
              return <SearchBar />
            case "hero_units":
              return <HeroUnits hero_units={data} />
            case "artwork":
              return <ArtworkRail ref={registerModule} key={data.__id} rail={data} />
            case "artist":
              return <ArtistRail ref={registerModule} key={data.__id} rail={data} />
          }
        }}
        onScroll={event => (this.currentScrollOffset = event.nativeEvent.contentOffset.y)}
        ref={listView => (this.listView = listView)}
        style={{ marginTop: 20, overflow: "visible" }}
      />
    )
  }
}

export default Relay.createContainer(Home, {
  fragments: {
    home: () => Relay.QL`
      fragment on HomePage {
        hero_units(platform: MOBILE) {
          ${HeroUnits.getFragment("hero_units")}
        }
        artwork_modules(max_rails: -1,
                        max_followed_gene_rails: -1,
                        order: [
                          ACTIVE_BIDS,
                          RECOMMENDED_WORKS,
                          FOLLOWED_ARTISTS,
                          RELATED_ARTISTS,
                          FOLLOWED_GALLERIES,
                          SAVED_WORKS,
                          LIVE_AUCTIONS,
                          CURRENT_FAIRS,
                          FOLLOWED_GENES,
                          GENERIC_GENES]) {
          __id
          ${ArtworkRail.getFragment("rail")}
        }
        artist_modules {
          __id
          ${ArtistRail.getFragment("rail")}
        }
      }
    `,
  },
})

interface RelayProps {
  home: {
    hero_units: Array<any | null> | null
    artwork_modules: Array<{
      __id: string
    } | null> | null
    artist_modules: Array<{
      __id: string
    } | null> | null
  }
}
