/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react';
import { ScrollView, View, Dimensions, Text } from 'react-native';

class Home extends React.Component {
  render() {
    const titles = [];
    this.props.home.modules.forEach((mod) => {
      titles.push(<Text key={mod.title}>{mod.title}</Text>);
    });
    return <View>{titles}</View>;
  }
}

export default Relay.createContainer(Home, {
  fragments: {
    home: () => Relay.QL`
      fragment on HomePage {
        modules {
          title
        }
      }
    `,
  }
})