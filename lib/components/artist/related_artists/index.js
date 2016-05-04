/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react-native';
const { ScrollView, StyleSheet, View } = React;
import ImageView from '../../opaque_image_view';

class RelatedArtists extends React.Component {
  render() {
    const artists = this.props.artists
    return (
      <View>
        <ScrollView horizontal={true} style={{ overflow: 'visible' }}>
          { artists.map(artist =>  <ImageView key={artist.id}
                                              style={{ height: 175, marginRight: 20 }}
                                              aspectRatio={1.7}
                                              imageURL={artist.image.url} />
          )}
        </ScrollView>
      </View>
    );
  }

  renderArtist(artist) {
    return (
      <ImageView style={{ height: 175, marginRight: 20 }}
                 aspectRatio={1.7}
                 imageURL={artist.image.url} />
    );
  }
}

export default Relay.createContainer(RelatedArtists, {
  fragments: {
    artists: () => Relay.QL`
      fragment on Artist @relay(plural: true) {
        id
        name
        image {
          url
        }
      }
    `
  }
})