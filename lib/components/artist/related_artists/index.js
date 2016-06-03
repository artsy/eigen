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
    this.state = this.layoutState();
  }

  layoutState() {
    const window = Dimensions.get('window');
    const isPad = window.width > 700;
    const isPadHorizontal = window.width > 1000;

    const columnCount = (isPad ? (isPadHorizontal ? 4 : 3) : 2);

    const imageWidth = (isPad ? (isPadHorizontal ? (window.width - 140)/4 : (window.width - 100)/3) : ((window.width - 60)/2))
    const imageHeight = Math.floor(imageWidth / 1.5);

    return {
      columns: columnCount,
      imageSize: {
        width: imageWidth,
        height: imageHeight,
      },
    };
  }

  onLayout(e) {
    const newLayoutState = this.layoutState();
    if (this.state.columns !== newLayoutState.columns) {
      this.setState(newLayoutState);
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
    const artistViews = artists.map(artist => {
      return <RelatedArtist key={artist.id} artist={artist} imageSize={this.state.imageSize} />;
    });

    const numberOfTrailingViews = artists.length % this.state.columns;
    if (numberOfTrailingViews > 0) {
      const extraRequiredViews = this.state.columns - numberOfTrailingViews;
      for (let i = 0; i < extraRequiredViews; i++) {
        artistViews.push(<View key={'related-artist-spacer-'+i} style={this.state.imageSize} />);
      }
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