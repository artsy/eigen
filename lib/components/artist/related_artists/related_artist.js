/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react-native';
const { ScrollView, StyleSheet, View, Text, Dimensions } = React;

import colors from '../../../../data/colors';
import SerifText from '../../text/serif';
import ImageView from '../../opaque_image_view';

class RelatedArtist extends React.Component {
  render() {
    const artist = this.props.artist;
    const {height, width} = Dimensions.get('window');
    const imageWidth = (width - 60)/2;
    const imageAspectRatio = 1.5;
    console.log(imageWidth, width);
    return (
      <View style={{ width: imageWidth }}>
        <ImageView style={{ height: imageWidth/1.5 }}
                   aspectRatio={1.5}
                   imageURL={artist.image.url} />
        <Text style={styles.sansSerifText}>{artist.name.toUpperCase()}</Text>
        <Text style={styles.serifText}>{this.artworksString(artist.counts)}</Text>
      </View>
    )
  }

  artworksString(counts) {
    const forSale = counts.for_sale_artworks ? counts.for_sale_artworks + ' for sale' : null
    const totalWorks = counts.artworks ? counts.artworks + ' works' : null

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
    marginTop: 10,
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
