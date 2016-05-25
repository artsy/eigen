/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react-native';
const { ScrollView, StyleSheet, View, Text, TouchableWithoutFeedback, Dimensions } = React;

import colors from '../../../../data/colors';
import SerifText from '../../text/serif';
import ImageView from '../../opaque_image_view';
import SwitchBoard from '../../../modules/switch_board';

const windowDimensions = Dimensions.get('window');
const imageWidth = windowDimensions.width > 700 ? (windowDimensions.width - 100)/3 : (windowDimensions.width - 60)/2;

class RelatedArtist extends React.Component {
  handleTap() {
    SwitchBoard.presentNavigationViewController(this, this.props.artist.href);
  }

  render() {
    const artist = this.props.artist;
    return (
      <TouchableWithoutFeedback onPress={this.handleTap.bind(this)} delayPressIn={5} delayPressOut={5}>
        <View style={{margin: 10, paddingBottom: 20, width: this.props.relay.variables.imageWidth}}>
          <ImageView style={{ width: this.props.relay.variables.imageWidth, height: this.props.relay.variables.imageHeight }}
                    imageURL={artist.image.cropped.url} />
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
  initialVariables: { imageWidth: Math.floor(imageWidth), imageHeight: Math.floor(imageWidth / 1.5) },

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
          cropped(width: $imageWidth, height: $imageHeight) {
            url
          }
        }
      }
    `,
  }
})
