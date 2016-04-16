/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react-native';
const { View, Text, TouchableHighlight } = React;

class Component extends React.Component {
  static propTypes = {
    artist: React.PropTypes.shape({
      name: React.PropTypes.string,
    }),
  };

  render() {
    const followAction = () => { console.log('TODO: Follow') };
    const artist = this.props.artist;
    return (
      <View>
        <Text>{artist.name}</Text>
        <Text>{artist.nationality}, b. {artist.birthday}</Text>
        <Text>{artist.counts.follows} Followers</Text>
        <TouchableHighlight onPress={followAction}>
          <Text>FOLLOW</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

export default Relay.createContainer(Component, {
  fragments: {
    artist: () => Relay.QL`
      fragment on Artist {
        name
        nationality
        birthday
        counts {
          follows
        }
      }
    `,
  }
});
