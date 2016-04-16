/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react-native';
const { Text } = React;

class Component extends React.Component {
  static propTypes = {
    artist: React.PropTypes.shape({
      name: React.PropTypes.string,
    }),
  };

  render() {
    return <Text>{this.props.artist.name}</Text>;
  }
}

export default Relay.createContainer(Component, {
  fragments: {
    artist: () => Relay.QL`
      fragment on Artist {
        name
      }
    `,
  }
});
