/* @flow */
'use strict'

import Relay from 'react-relay'
import React from 'react'

import { View, Image, StyleSheet, TouchableWithoutFeedback, Text } from 'react-native'

import Biography from './biography'
import Articles from './articles'
import RelatedArtists from '../related_artists'
import Separator from '../separator'
import SwitchBoard from '../../native_modules/switch_board'

class About extends React.Component {
  render() {
    return (
      <View>
        { this.biography() }
        { this.articles() }
        { this.relatedArtists() }
      </View>
    )
  }

  biography() {
    if (this.props.artist.has_metadata) {
      return (
        <View>
          <Biography artist={this.props.artist} />
          { this.auctionResults() }
          <Separator style={styles.sectionSeparator} />
        </View>
      )
    }
  }

  auctionResults() {
    // Bail early
    if (this.props.artist.is_display_auction_link === false) { return null }
    // TODO: Refactor into:
    //<NavButton title="Auction Results" href={`/artist/${this.props.artist.id}/auctions`} />
    return (
      <TouchableWithoutFeedback onPress={this.openAuctionsURL}>
        <View style={{ marginBottom: 20, marginLeft: 20, marginRight: 20 }}>
          <Separator />
          <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 0 }}>
            <Text style={{ marginLeft:-20, fontFamily: 'Avant Garde Gothic ITCW01Dm',  marginTop: 14, marginBottom:14 }} >AUCTION RESULTS</Text>
            <Image style={{alignSelf: 'center', marginRight:-20}} source={require('../../../images/horizontal_chevron.png')} />
          </View>
          <Separator />
        </View>
      </TouchableWithoutFeedback>
    )
  }

  openAuctionsURL = () => {
    SwitchBoard.presentNavigationViewController(this, `/artist/${this.props.artist.id}/auction-results`)
  }

  articles() {
    if (this.props.artist.articles.length) {
      return (
        <View>
          <Articles articles={this.props.artist.articles} />
          <Separator style={styles.sectionSeparator} />
        </View>
      )
    }
  }

  relatedArtists() {
    return this.props.artist.related_artists.length ? <RelatedArtists artists={this.props.artist.related_artists}/> : null
  }

}

const styles = StyleSheet.create({
  sectionSeparator: {
    marginBottom: 20,
  }
})

export default Relay.createContainer(About, {
  fragments: {
    artist: () => Relay.QL`
      fragment on Artist {
        has_metadata
        is_display_auction_link
        ${Biography.getFragment('artist')}
        related_artists: artists(size: 16) {
          ${RelatedArtists.getFragment('artists')}
        }
        articles {
          ${Articles.getFragment('articles')}
        }
      }
    `,
  }
})
