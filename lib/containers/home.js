/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react';
import { ScrollView, View, Dimensions, TextView } from 'react-native';

class Home extends React.Component {
  render() {
    return (
      <View>
        <TextView>HOME GOES HERE</TextView>
      </View>
    );
  }
}

export default Relay.createContainer(Home, {
  fragments: {
    home: () => Relay.QL`
      fragment on HomePageModules @relay(plural: true) {
        title
      }
    `,
  }
})