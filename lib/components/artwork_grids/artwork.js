/* @flow */
'use strict'

import Relay from 'react-relay'
import React from 'react'
import { Image, View, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import { map } from 'lodash'

import ImageView from '../opaque_image_view'
import SerifText from '../text/serif'
import colors from '../../../data/colors'
import SwitchBoard from '../../native_modules/switch_board'

class Artwork extends React.Component {
  handleTap() {
    SwitchBoard.presentNavigationViewController(this, this.props.artwork.href)
  }

  render() {
    const artwork = this.props.artwork
    return (
      <TouchableWithoutFeedback onPress={this.handleTap.bind(this)}>
        <View>
          <ImageView style={styles.image} aspectRatio={artwork.image.aspect_ratio} imageURL={artwork.image.url} />
          { this.artists() }
          { this.artworkTitle() }
          { this.props.artwork.partner ? <SerifText style={styles.text}>{ this.props.artwork.partner.name }</SerifText> : null }
          { this.saleMessage() }
        </View>
      </TouchableWithoutFeedback>
    )
  }

  artists() {
    const artists = this.props.artwork.artists
    if (artists && artists.length > 0) {
      return (
        <SerifText style={[styles.text, styles.artist]}>
          {map(artists, 'name').join(', ')}
        </SerifText>
      )
    } else {
      return null
    }
  }

  artworkTitle() {
    const artwork = this.props.artwork
    if (artwork.title) {
      return (
        <SerifText style={styles.text}>
          <SerifText style={[styles.text, styles.title]}>{ artwork.title }</SerifText>
          { artwork.date ? (', ' + artwork.date) : '' }
        </SerifText>
      )
    } else {
      return null
    }
  }

  saleMessage() {
    const artwork = this.props.artwork
    if (artwork.is_in_auction) {
      return (
        <View style={{flexDirection: 'row'}}>
          <Image style={{ marginRight: 4 }} source={require('../../../images/paddle.png')} />
          <SerifText style={styles.text}>Bid now</SerifText>
        </View>
      )
    } else {
      return artwork.sale_message && <SerifText style={styles.text}>{artwork.sale_message}</SerifText>
    }
   }
}

Artwork.propTypes = {
  artwork: React.PropTypes.shape({
    title: React.PropTypes.string,
    sale_message: React.PropTypes.string,
    image: React.PropTypes.shape({
      url: React.PropTypes.string,
      aspect_ratio: React.PropTypes.number,
    }),
    artists: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        name: React.PropTypes.string,
      }),
    ),
    partner: React.PropTypes.shape({
      name: React.PropTypes.string,
    }),
  }),
}

const styles = StyleSheet.create({
  image: {
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    color: colors['gray-semibold'],
  },
  artist: {
    fontWeight: 'bold',
  },
  title: {
    fontStyle: 'italic',
  }
})

export default Relay.createContainer(Artwork, {
  fragments: {
    artwork: () => Relay.QL`
      fragment on Artwork {
        title
        date
        sale_message
        is_in_auction
        image {
          url(version: "large")
          aspect_ratio
        }
        artists {
          name
        }
        partner {
          name
        }
        href
      }
    `
  }
})
