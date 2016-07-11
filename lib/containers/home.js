/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react';
import { ScrollView, View, Dimensions, Text } from 'react-native';

class Home extends React.Component {
  componentDidMount() {
    this.props.relay.setVariables({ fetchContent: true });
  }

  // TODO Right now metaphysics only returns artworks, but there will be artists rails.
  render() {
    const modules = [];
    this.props.home.modules.forEach((mod) => {
      modules.push(
        <View key={mod.key}>
          <Text>{mod.title}</Text>
          <View style={{ marginLeft: 20 }}>
            {(mod.results || []).map(artwork => <Text key={mod.key + artwork.__id}>{artwork.title}</Text>)}
          </View>
        </View>
      );
    });
    return <ScrollView>{modules}</ScrollView>;
  }
}

export default Relay.createContainer(Home, {
  initialVariables: {
    fetchContent: false,
  },

  fragments: {
    home: () => Relay.QL`
      fragment on HomePage {
        modules {
          key
          title
          results @include(if: $fetchContent) {
            __id
            title
          }
        }
      }
    `,
  }
})