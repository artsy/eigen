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
    constructor(props) {
    super(props);
    this.onLayout = this.onLayout.bind(this);
    this.state = { columns: this.columnCount() };
  }

  columnCount() {
    const window = Dimensions.get('window')
    const isPad = window.width > 700;
    const isPadHorizontal = window.width > 1000;
    return isPad ? (isPadHorizontal ? 4 : 3) : 2;
  }

  onLayout(e) {
    const columnCountRequired = this.columnCount();
    if (this.state.columns !== columnCountRequired) {
      this.setState({
        columns: columnCountRequired,
      });
    }
  }

  render() {
    const artists = this.props.artists;
    return (
      <View style={styles.container} onLayout={this.onLayout}>
        <SerifText style={styles.heading}>Related Artists</SerifText>
        <View style={styles.artistContainer}>
          { this.renderArtists() }
        </View>
      </View>
    );
  }

  renderArtists() {
    const artists = this.props.artists;
    const artistViews = artists.map(artist => <RelatedArtist key={artist.id} artist={artist} />);
    const extraRequiredViews = this.state.columns - (artists.length % this.state.columns);
    for (var i = 0; i < extraRequiredViews; i++) {
      artistViews.push(<RelatedArtist key={'related-artist-spacer-'+i} artist={null} />);
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