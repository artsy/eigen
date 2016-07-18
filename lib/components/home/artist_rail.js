/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react';
import { View, Text } from 'react-native';

import Spinner from '../spinner';

class ArtistRail extends React.Component {
  componentDidMount() {
    this.props.relay.setVariables({ fetchContent: true });
  }

  renderModuleResults() {
    if (this.props.rail.results) {
      return this.props.rail.results.map(artist => {
        // Compose key, because an artist may appear twice on the home view in different modules.
        const key = this.props.rail.__id + artist.__id;
        return <Text key={key}>{artist.name}</Text>;
      });
    } else {
      return <Spinner style={{ flex: 1 }} />;
    }
    return null;
  }

  render() {
    return (
      <View>
        <Text>{this.props.rail.key}</Text>
        <View style={{ marginLeft: 20 }}>
          {this.renderModuleResults()}
        </View>
      </View>
    );
  }
}

export default Relay.createContainer(ArtistRail, {
  initialVariables: {
    fetchContent: false,
  },

  fragments: {
    rail: () => Relay.QL`
      fragment on HomePageArtistModule {
        __id
        key
        results @include(if: $fetchContent) {
          __id
          name
        }
      }
    `,
  }
});
