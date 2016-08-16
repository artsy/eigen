/* @flow */
'use strict'

import Relay from 'react-relay'
import React from 'react'
import { StyleSheet, Dimensions, View, Text } from 'react-native'

import SerifText from '../../text/serif'
import colors from '../../../../data/colors'
import Button from '../../buttons/inverted_button'

const isPad = Dimensions.get('window').width > 700

class ArtworkRailHeader extends React.Component {
  render() {
    return (
      <View>
        <SerifText numberOfLines={2} style={styles.title}>{ this.props.rail.title }</SerifText>
        { this.props.rail.context && this.actionButton() }
      </View>
    )
  }

  actionButton() {
    switch (this.props.rail.context.__typename) {
      case 'HomePageModuleContextFollowArtists':
        return <Text style={styles.viewAllButton}> { 'View All'.toUpperCase() } </Text>
      case 'HomePageModuleContextRelatedArtist':
        return (
          <View style={styles.followButton}>
            <Button text={'Follow'}/>
          </View>
        )
      default:
        return null
    }
  }
}

const styles = StyleSheet.create({
  title: {
    marginTop: isPad ? 50 : 40,
    fontSize: isPad ? 30 : 26,
    alignSelf: 'center',
    textAlign: 'center',
  },
  viewAllButton: {
    fontFamily: 'Avant Garde Gothic ITCW01Dm',
    fontSize: 15,
    color: colors['gray-medium'],
    textAlign: 'center',
    letterSpacing: 0.5,
    marginBottom: 20,
  },
  followButton: {
    marginTop: 10,
    marginBottom: 20,
    margin: 160,
    height: 35,
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
