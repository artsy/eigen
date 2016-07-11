/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react';
import { ScrollView, View, Dimensions, Text } from 'react-native';

import Spinner from '../components/spinner';

class Home extends React.Component {
  componentDidMount() {
    this.props.relay.setVariables({ fetchContent: true });
  }

  renderModuleResults(mod) {
    if (mod.results) {
      return mod.results.map(artwork => {
        // Compose key, because an artwork may appear twice on the home view in different modules.
        const key = mod.key + artwork.__id;
        return <Text key={key}>{artwork.title}</Text>;
      });
    } else {
      return <Spinner style={{ flex: 1 }} />;
    }
    return null;
  }

  renderModule(mod) {
    return (
      <View key={mod.key}>
        <Text>{mod.title}</Text>
        <View style={{ marginLeft: 20 }}>
          {this.renderModuleResults(mod)}
        </View>
      </View>
    );
  }

  // TODO Right now metaphysics only returns artworks, but there will be artists rails.
  render() {
    return (
      <ScrollView>
        {this.props.home.modules.map(mod => this.renderModule(mod))}
      </ScrollView>
    );
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