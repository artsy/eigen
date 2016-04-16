/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react-native';
const { View, Text } = React;

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
        <Text>BIOGRAPHY</Text>
        <Text>{artist.bio}</Text>
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
