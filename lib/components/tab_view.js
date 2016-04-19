/* @flow */
'use strict';

import React from 'react-native';
const { View } = React;

import SwitchView from './switch_view';

export default class TabView extends React.Component {
  render() {
    return (
      <View>
        <SwitchView />
      </View>
    );
  }
}
