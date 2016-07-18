/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react';
import { View, Text } from 'react-native';

import Spinner from '../spinner';

class ArtworkRail extends React.Component {
  componentDidMount() {
    this.props.relay.setVariables({ fetchContent: true });
  }

  renderModuleResults() {
    if (this.props.rail.results) {
      return this.props.rail.results.map(artwork => {
        // Compose key, because an artwork may appear twice on the home view in different modules.
        const key = this.props.rail.__id + artwork.__id;
        return <Text key={key}>{artwork.title}</Text>;
      });
    } else {
      return <Spinner style={{ flex: 1 }} />;
    }
    return null;
  }

  render() {
    return (
      <View>
        <Text>{this.props.rail.title}</Text>
        <View style={{ marginLeft: 20 }}>
          {this.renderModuleResults()}
        </View>
      </View>
    );
  }
}

export default Relay.createContainer(ArtworkRail, {
  initialVariables: {
    fetchContent: false,
  },

  fragments: {
    rail: () => Relay.QL`
      fragment on HomePageArtworkModule {
        __id
        title
        results @include(if: $fetchContent) {
          __id
          title
        }
      }
    `,
  }
});
