/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react';
import { ScrollView, StyleSheet, View, Dimensions } from 'react-native';

import colors from '../../../../data/colors';
import SerifText from '../../text/serif';
import ImageView from '../../opaque_image_view';
import RelatedArtist from './related_artist'

class RelatedArtists extends React.Component {
  render() {
    const artists = this.props.artists;
    return (
      <View style={styles.container}>
        <SerifText style={styles.heading}>Related Artists</SerifText>
        <View style={styles.artistContainer}>
          { this.renderArtists() }
        </View>
      </View>
    );
  }


  renderArtists() {
    const artists = this.props.artists;
    var artistViews = artists.map(artist => <RelatedArtist key={artist.id} artist={artist} />);
    const isPhone = Dimensions.get('window').width < 700;
    const isPadHorizontal = Dimensions.get('window').width > 1000; // not being used yet
    const extraRequiredViews = artists.length % (isPhone ? 2 : 3);
    for (var i = 0; i < extraRequiredViews; i++) { 
      artistViews.push(<RelatedArtist key={'dummy'+i.toString()} artist={null}/>);
    }
    return artistViews;
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  artistContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginLeft: -10,
    marginRight: -10,
  },
  heading: {
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