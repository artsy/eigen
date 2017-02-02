// @flow
'use strict'

import React from 'react'
import { AppRegistry } from 'react-native'
import Relay from 'react-relay'
import _ from 'lodash'

import Spinner from './components/spinner'
import LoadFailureView from './components/load_failure_view'
import Containers from './containers'
import Routes from './relay/routes'

class RootContainer extends React.Component {
  state: { retrying: boolean }
  component: RootContainer
  route: Relay.Route

  constructor(props) {
    super(props)
    this.state = { retrying: false }
  }

  render() {
    // https://facebook.github.io/relay/docs/guides-root-container.html
    return (<Relay.RootContainer
             Component={this.component}
             route={this.route}
             renderLoading={() => {
               if (this.state.retrying) {
                 // This will re-use the native view first created in the renderFailure callback, which means it can
                 // continue its ‘retry’ animation.
                 return <LoadFailureView style={{ flex: 1 }} />
               } else {
                 return <Spinner style={{ flex: 1 }} />
               }
             }}
             renderFailure={(error, retry) => {
               this.state.retrying = true
               return <LoadFailureView onRetry={retry} style={{ flex: 1 }} />
             }}
           />)
  }
}

class Artist extends RootContainer {
  constructor(props) {
    super(props)
    this.component = Containers.Artist
    this.route = new Routes.Artist({ artistID: props.artistID })
  }
}

class Gene extends RootContainer {
  constructor(props) {
    super(props)
    this.component = Containers.Gene

    const medium = _.get(props, 'refineSettings.medium')
    const price_range = _.get(props, 'refineSettings.price_range')

    this.route = new Routes.Gene({
      geneID: props.geneID,
      medium: medium ? medium : '*',
      // The replace can be removed once metaphysics#486 is merged
      price_range: price_range ? price_range.replace(/\.00/g, '') : '*-*'
    })
  }
}

class Home extends RootContainer {
  constructor(props) {
    super(props)
    this.component = Containers.Home
    this.route = new Routes.Home()
  }
}

AppRegistry.registerComponent('Artist', () => Artist)
AppRegistry.registerComponent('Home', () => Home)
AppRegistry.registerComponent('Gene', () => Gene)
