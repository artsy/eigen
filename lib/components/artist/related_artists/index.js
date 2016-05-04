/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react-native';
const { ScrollView, StyleSheet, View } = React;

import colors from '../../../../data/colors';
import SerifText from '../../text/serif';
import ImageView from '../../opaque_image_view';
import RelatedArtist from './related_artist'

class RelatedArtists extends React.Component {
  render() {
    const artists = this.props.artists
    return (
      <View style={styles.container}>
        <SerifText style={styles.heading}>Related Artists</SerifText>
        <ScrollView horizontal={true} style={{ overflow: 'visible', marginBottom: 40 }}>
          { artists.map(artist => <RelatedArtist key={artist.id} artist={artist} /> )}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: colors['gray-regular'],
  },
  heading: {
    marginTop: 20,
    marginBottom: 20,
    fontSize: 20,
  }
});

export default Relay.createContainer(RelatedArtists, {
  fragments: {
    artists: () => Relay.QL`
      fragment on Artist @relay(plural: true) {
        id
        ${RelatedArtist.getFragment('artist')}
      }
    `
  }
})