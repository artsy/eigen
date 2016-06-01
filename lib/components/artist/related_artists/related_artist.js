/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableWithoutFeedback, Dimensions } from 'react-native';

import colors from '../../../../data/colors';
import SerifText from '../../text/serif';
import ImageView from '../../opaque_image_view';
import SwitchBoard from '../../../modules/switch_board';

class RelatedArtist extends React.Component {
  handleTap() {
    SwitchBoard.presentNavigationViewController(this, this.props.artist.href);
  }

  render() {
    const artist = this.props.artist;
    const imageURL = artist.image ? artist.image.url : null;

    const window = Dimensions.get('window');
    const imageWidth = (window.width > 700 ? ((window.width - 100) / 3) : ((window.width - 60) / 2));
    const imageHeight = Math.floor(imageWidth / 1.5);

    return (
      <TouchableWithoutFeedback onPress={this.handleTap.bind(this)}>
        <View style={{ margin: 5, paddingBottom: 20, width: imageWidth }}>
          <ImageView style={{ width: imageWidth, height: imageHeight }} imageURL={imageURL} />
          <Text style={styles.sansSerifText}>{artist.name.toUpperCase()}</Text>
          <Text style={styles.serifText}>{this.artworksString(artist.counts)}</Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  artworksString(counts) {
    if (counts.totalWorks <= 0) {
      return "";
    }

    const totalWorks = counts.artworks ? counts.artworks + (counts.artworks > 1 ? ' works' : ' work') : null;
    if (counts.for_sale_artworks === counts.artworks) {
      return totalWorks + ' for sale';
    }

    const forSale = counts.for_sale_artworks ? counts.for_sale_artworks + ' for sale' : null;
    if (forSale && totalWorks) {
      return totalWorks + ', ' + forSale;
    }
    return forSale ? forSale : totalWorks;
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
        href
        name
        counts {
          for_sale_artworks
          artworks
        }
        image {
          url(version: "large")
        }
      }
    `,
  }
})
