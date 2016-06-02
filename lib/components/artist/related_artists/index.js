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
    this.state = { columns: this.columnCount()};
    this.onLayout = this.onLayout.bind(this);
  }
  
  columnCount() {
    const window = Dimensions.get('window')
    const isPhone = window.width < 700;
    const isPadHorizontal = window.width > 1000;
    console.log('wid' + window.width);
    return !isPhone ? (isPadHorizontal ? 4 : 3) : 2;
  }
  
  onLayout(e) {
    console.log('RENDERYO')
    const columnCountRequired = this.columnCount();
    console.log('col req' + columnCountRequired);
    console.log('col curr' + this.state.columns);
    if (this.state.columns !== columnCountRequired) {
      this.setState({
    columns: this.columnCount()
  });
    }
    
    // TODO ensure that on the initial render, and when it calls this callback, setting the state again should not
    // actually cause another render, as the number of columns should remain the same.
  }

  render() {
    const artists = this.props.artists;
    const callback = (event) => { this.onLayout(event) };
    return (
      <View style={styles.container} onLayout={callback}>
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
    const extraRequiredViews = this.state.columns - (artists.length % this.state.columns);
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