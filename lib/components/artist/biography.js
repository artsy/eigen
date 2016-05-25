/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react-native';
const { View, Text, Dimensions } = React;

import removeMarkdown from 'remove-markdown';

import Headline from '../text/headline';
import SerifText from '../text/serif';

const sideMargin = Dimensions.get('window').width > 700 ? 50 : 0;

class Biography extends React.Component {
  static propTypes = {
    artist: React.PropTypes.shape({
      bio: React.PropTypes.string,
    }),
  };

  render() {
    const artist = this.props.artist;
    if (artist.blurb.length === 0 && artist.bio.length === 0) { return null; }

    return (
      <View style={{marginLeft: sideMargin, marginRight: sideMargin}}>
        <Headline style={{ marginBottom: 20 }}>Biography</Headline>
        { this.blurb(artist) }
        <SerifText style={{ marginBottom: 40 }}>{artist.bio}</SerifText>
      </View>
    );
  }

  blurb(artist) {
    return artist.blurb ? <SerifText style={{ marginBottom: 20, lineHeight: 25 }} numberOfLines={0}>{removeMarkdown(artist.blurb)}</SerifText> : null;
  }
}

export default Relay.createContainer(Biography, {
  fragments: {
    artist: () => Relay.QL`
      fragment on Artist {
        bio
        blurb
      }
    `,
  }
});
