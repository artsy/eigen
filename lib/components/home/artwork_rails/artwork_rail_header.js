/* @flow */
'use strict'

import Relay from 'react-relay'
import React from 'react'
import { StyleSheet, Dimensions } from 'react-native'

import SerifText from '../../text/serif'

const isPad = Dimensions.get('window').width > 700

class ArtworkRailHeader extends React.Component {
  render() {
    return (
      <SerifText numberOfLines={2} style={styles.title}>{ this.props.rail.title + '\n' + (this.props.rail.context && this.props.rail.context.__typename) }</SerifText>
    )
  }
}

const styles = StyleSheet.create({
  title: {
    margin: isPad ? 40 : 20,
    marginBottom: isPad ? 30 : 20,
    marginTop: isPad ? 50 : 40,
    fontSize: isPad ? 30 : 26,
    alignSelf: 'center',
    textAlign: 'center',
  },
})

export default Relay.createContainer(ArtworkRailHeader, {
  fragments: {
    rail: () => Relay.QL`
      fragment on HomePageArtworkModule {
        title
        context {
          __typename
        }
      }
    `,
  }
})
