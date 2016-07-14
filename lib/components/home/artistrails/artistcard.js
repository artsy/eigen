/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableWithoutFeedback } from 'react-native';

import colors from '../../../../data/colors';
import SerifText from '../../text/serif';
import ImageView from '../../opaque_image_view';
import SwitchBoard from '../../../modules/switch_board';
import InvertedButton from '../../buttons/inverted_button';

class ArtistRail extends React.Component {

  render() {

    return (
      <View style={styles.container}>
        <View style={styles.touchableContainer}>
          <ImageView style={styles.image} />
          <View style={styles.textContainer}>
            <Text style={styles.sansSerifText}>ANDY WARHOL</Text>
            <Text style={styles.serifText}>American, b. 1960</Text>
            <Text style={[styles.serifText, styles.serifWorksText]}>38 works, 4 for sale</Text>
          </View>
          <View style={styles.followButton}>
            <InvertedButton text={'Follow'} />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  // TODO The outer wrapping view is currently only there because setting `marginLeft: 16` on the Artist card from the
  //      ArtistRails component isn’t working.
  container: {
    width: 236,
    height: 310,
  },
  touchableContainer: {
    width: 220,
    height: 280,
    marginLeft: 16,
    borderColor: '#F3F3F3',
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {
      height: 2,
      width: 0
    }
    
  },
  image: {
    width: 196,
    height: 148,
    marginTop: 12,
    marginLeft: 12,
  },
  textContainer: {
    marginLeft: 12,
    marginTop: 12,
  },
  sansSerifText: {
    fontSize: 12,
    textAlign: 'left',
    fontFamily: "Avant Garde Gothic ITCW01Dm",
  },
  serifText: {
    fontFamily: 'AGaramondPro-Regular',
    fontSize: 16,
    marginBottom: -4,
    color: '#000000'
  },
    serifWorksText: {
    color: colors['gray-semibold'],
  },
  followButton: {
    marginTop: 18,
    marginLeft: 12,
    width: 196,
    height: 30,
  }
});

module.exports = ArtistRail;


// export default Relay.createContainer(Article, {
//   fragments: {
//     article: () => Relay.QL`
//       fragment on Article {
//         thumbnail_title
//         href
//         author {
//           name
//         }
//         thumbnail_image {
//           url(version: "large")
//         }
//       }
//     `,
//   }
// })