import * as Relay from 'react-relay'
import * as React from 'react'

import { ListView, ListViewDataSource, ScrollView, RefreshControl, ViewProperties } from 'react-native'

import HeroUnits from '../components/home/hero_units'
import ArtworkRail from '../components/home/artwork_rails/artwork_rail'
import ArtistRail from '../components/home/artist_rails/artist_rail'
import SearchBar from '../components/home/search_bar'

type DataSourceRow = {
  type: 'search_bar' | 'hero_units' | 'artwork' | 'artist',
  data: any,
}

interface Props extends ViewProperties {
}

interface State {
  modules: any[]
  isRefreshing: boolean
  dataSource: ListViewDataSource
}

class Home extends React.Component<Props, State> {
  constructor(props) {
    super(props)

    const rows: DataSourceRow[] = [
      { type: 'search_bar', data: null },
      { type: 'hero_units', data: props.home.hero_units },
    ]
    const artwork_modules = props.home.artwork_modules
    const artist_modules = props.home.artist_modules && props.home.artist_modules.concat() // create a copy so we can mutate it (with `shift`)

    for (let i = 0; i < artwork_modules.length; i++) {
      const artwork_module = artwork_modules[i]
      rows.push({ type: 'artwork', data: artwork_module })
      if ((i + 1) % 2 === 0) {
        const artist_module = artist_modules.shift()
        if (artist_module) {
          rows.push({ type: 'artist', data: artist_module })
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

    Promise.all(this.state.modules.map(module => {
      return new Promise((resolve, reject) => {
        module.forceFetch(null, (readyState) => {
          if (readyState.error) {
            reject(readyState.error)
          } else if (readyState.aborted) {
            reject()
          } else if (readyState.done) {
            resolve()
          }
        })
      })
    })).then(stopRefreshing, stopRefreshing)
  }

  render() {
    return (
      <ListView dataSource={this.state.dataSource}
                renderScrollComponent={(props) => {
                  const refreshControl = <RefreshControl refreshing={this.state.isRefreshing}
                                                         onRefresh={this.handleRefresh} />
                  return <ScrollView {...props} automaticallyAdjustContentInsets={false}
                                                refreshControl={refreshControl} />
                }}
                renderRow={({ type, data }, _, row) => {
                  // Offset row because we don’t store a reference to the search bar and hero units rows.
                  const registerModule = (module) => this.state.modules[row - 2] = module  // eslint-disable-line no-return-assign
                  switch (type) {
                    case 'search_bar':
                      return <SearchBar />
                    case 'hero_units':
                      return <HeroUnits hero_units={data} />
                    case 'artwork':
                      return <ArtworkRail ref={registerModule} key={data.__id} rail={data} />
                    case 'artist':
                      return <ArtistRail ref={registerModule} key={data.__id} rail={data} />
                  }
                }}
                style={{ marginTop: 20, overflow: 'visible' }} />
    )
  }
}

export default Relay.createContainer(Home, {
  fragments: {
    home: () => Relay.QL`
      fragment on HomePage {
        hero_units(platform: MOBILE) {
          ${HeroUnits.getFragment('hero_units')}
        }
        artwork_modules(max_rails: -1,
                        max_followed_gene_rails: -1,
                        order: [
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
          ${ArtworkRail.getFragment('rail')}
        }
        artist_modules {
          __id
          ${ArtistRail.getFragment('rail')}
        }
      }
    `,
  }
})
