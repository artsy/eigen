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
      <View style={styles.container}>
        { this.props.rail.context && this.followAnnotation() }
        <SerifText numberOfLines={2} style={styles.title}>{ this.props.rail.title }</SerifText>
        { this.props.rail.context && this.actionButton() }
      </View>
    )
  }

  followAnnotation() {
    // string comparing feels super weird but making a javascript 'enum' might be worse?
    if (this.props.rail.context.__typename === 'HomePageModuleContextRelatedArtist') {
      return <SerifText style={styles.followAnnotation}>{ 'Based on ' + this.props.rail.context.based_on.name }</SerifText>
    }
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
  container: {
    marginTop: 30,
    marginBottom: 30,
  },
  title: {
    marginTop: 10,
    fontSize: isPad ? 30 : 26,
    alignSelf: 'center',
    textAlign: 'center',
  },
  viewAllButton: {
    fontFamily: 'Avant Garde Gothic ITCW01Dm',
    fontSize: isPad ? 14 : 12,
    color: colors['gray-medium'],
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  followButton: {
    marginTop: 10,
    marginBottom: 0,
    margin: isPad ? 160 : 135,
    height: 30,
  },
  followAnnotation: {
    fontStyle: 'italic',
    alignSelf: 'center',
    fontSize: 16,
  }
})

const relatedArtistFragment = Relay.QL`
  fragment related_artists_context on HomePageModuleContextRelatedArtist {
    artist {
      href
      id
    }
    based_on {
      name
    }
  }
`
export default Relay.createContainer(ArtworkRailHeader, {
  fragments: {
    rail: () => Relay.QL`
      fragment on HomePageArtworkModule {
        title
        context {
          __typename
          ${ relatedArtistFragment }
        }
      }
    `,
  }
})
