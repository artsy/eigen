/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react-native';
const { View, Text } = React;

import removeMarkdown from 'remove-markdown';

import Headline from '../text/headline';
import SerifText from '../text/serif';

class Biography extends React.Component {
  static propTypes = {
    artist: React.PropTypes.shape({
      bio: React.PropTypes.string,
    }),
  };

  render() {
    const artist = this.props.artist;
    return (
      <View>
        <Headline style={{ marginBottom: 20 }}>Biography</Headline>
        <SerifText style={{ marginBottom: 20 }} numberOfLines={0}>{removeMarkdown(artist.blurb)}</SerifText>
        <SerifText style={{ marginBottom: 40 }}>{artist.bio}</SerifText>
      </View>
    );
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
