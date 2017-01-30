import Relay from 'react-relay'
import React from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'

import removeMarkdown from 'remove-markdown'

import Headline from '../text/headline'
import SerifText from '../text/serif'

const sideMargin = Dimensions.get('window').width > 700 ? 50 : 0

class Biography extends React.Component {
  static propTypes = {
    artist: React.PropTypes.shape({
      bio: React.PropTypes.string,
    }),
  };

  render() {
    const artist = this.props.artist
    if (!artist.blurb && !artist.bio) {
      return null
    }

    return (
      <View style={{marginLeft: sideMargin, marginRight: sideMargin}}>
        <Headline style={{ marginBottom: 20 }}>Biography</Headline>
        { this.blurb(artist) }
        <SerifText style={styles.bio} numberOfLines={0}>{this.bioText()}</SerifText>
      </View>
    )
  }

  blurb(artist) {
    return artist.blurb ? <SerifText style={styles.blurb} numberOfLines={0}>{removeMarkdown(artist.blurb)}</SerifText> : null
  }

  bioText() {
    const bio = this.props.artist.bio
    return bio.replace('born', 'b.')
  }
}

const styles = StyleSheet.create({
  blurb: {
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 20
  },
  bio: {
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 40
  }
})

export default Relay.createContainer(Biography, {
  fragments: {
    artist: () => Relay.QL`
      fragment on Artist {
        bio
        blurb
      }
    `,
  }
})
