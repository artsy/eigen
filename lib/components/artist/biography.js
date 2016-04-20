/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react-native';
const { View, Text } = React;

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
        <SerifText style={{ marginBottom: 20 }}>{artist.bio}</SerifText>
      </View>
    );
  }
}

export default Relay.createContainer(Biography, {
  fragments: {
    artist: () => Relay.QL`
      fragment on Artist {
        bio
      }
    `,
  }
});
