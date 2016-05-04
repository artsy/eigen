/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react-native';
const { ScrollView, StyleSheet, View, Text } = React;

import colors from '../../../../data/colors';
import SerifText from '../../text/serif';
import ImageView from '../../opaque_image_view';

class RelatedArtist extends React.Component {
  render() {
    const artist = this.props.artist;
    return (
      <View style={{ width: 300 }}>
        <ImageView style={{ height: 175, marginRight: 20 }}
                   aspectRatio={1.7}
                   imageURL={artist.image.url} />
        <Text style={styles.sansSerifText}>{artist.name.toUpperCase()}</Text>
        <Text style={styles.serifText}>{this.artworksString(artist)}</Text>
      </View>
    )
  }

  artworksString(artist) {
    const forSale = artist.counts.for_sale_artworks ? artist.counts.for_sale_artworks + ' for sale' : null
    const totalWorks = artist.counts.artworks ? artist.counts.artworks + ' works' : null

    if (forSale && totalWorks) {
      return totalWorks + ', ' + forSale
    }
    return forSale ? forSale : totalWorks
  }
}

const styles = StyleSheet.create({
  sansSerifText: {
    fontSize: 12,
    textAlign: 'left',
    marginTop: 5,
    fontFamily: "Avant Garde Gothic ITCW01Dm",
  },
  serifText: {
    fontFamily: 'AGaramondPro-Regular',
    fontSize: 16,
    marginTop: 5,
    color: colors['gray-semibold']
  }
});

export default Relay.createContainer(RelatedArtist, {
  fragments: {
    artist: () => Relay.QL`
      fragment on Artist {
        name
        counts {
          for_sale_artworks
          artworks
        }
        image {
          url
        }
      }
    `,
  }
})
