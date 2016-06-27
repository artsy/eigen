/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react';
import { ScrollView, View, Dimensions, TextView } from 'react-native';

class Home extends React.Component {
  render() {
    return (
      <ScrollView scrollsToTop={true}>
        <TextView>HOME GOES HERE</TextView>
      </ScrollView>
    );
  }
}