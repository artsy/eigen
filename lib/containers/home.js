/* @flow */
'use strict'

import Relay from 'react-relay'
import React from 'react'
import { ScrollView, RefreshControl } from 'react-native'

import HeroUnits from '../components/home/hero_units'
import ArtworkRail from '../components/home/artwork_rails/artwork_rail'
import ArtistRail from '../components/home/artist_rails/artist_rail'
import SearchBar from '../components/home/search_bar'

class Home extends React.Component {
  state: {
    modules: any[],
    isRefreshing: boolean
  }

  constructor() {
    super()
    this.state = {
      isRefreshing: false,
      modules: [],
    }
  }

  registerModule(module) {
    if (module) {
      this.state.modules.push(module)
    }
  }

  render() {
    this.state.modules = []

    const modules = []
    const artwork_modules = this.props.home.artwork_modules
    const artist_modules = this.props.home.artist_modules.concat() // create a copy
    for (let i = 0; i < artwork_modules.length; i++) {
      const artwork_module = artwork_modules[i]
      modules.push(<ArtworkRail ref={this.registerModule.bind(this)} key={artwork_module.__id} rail={artwork_module} />)
      // For now, show an artist rail after each 2 artwork rails, until the artist rails array is depleted.
      if ((i + 1) % 2 === 0) {
        const artist_module = artist_modules.shift()
        if (artist_module) {
          modules.push(<ArtistRail ref={this.registerModule.bind(this)} key={artist_module.__id} rail={artist_module} />)
        }
      }
    }
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.isRefreshing}
            onRefresh={this.refresh.bind(this)}
            />
        }>
        <HeroUnits hero_units={this.props.home.hero_units} />
        <SearchBar />
        {modules}
      </ScrollView>
    )
  }
  refresh() {
    this.setState({isRefreshing: true})
    this.state.modules.forEach((module) => module.forceFetch())
    this.setState({isRefreshing: false})
  }
}

export default Relay.createContainer(Home, {
  fragments: {
    home: () => Relay.QL`
      fragment on HomePage {
        hero_units(platform: MOBILE) {
          ${HeroUnits.getFragment('hero_units')}
        }
        artwork_modules(max_rails: 99) {
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
