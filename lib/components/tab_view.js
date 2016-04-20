/* @flow */
'use strict';

import React from 'react-native';
const { View } = React;

import SwitchView from './switch_view';
import type SwitchEvent from './switch_view';

export default class TabView extends React.Component {
  render() {
    return (
      <View>
        <SwitchView {...this.props} />
      </View>
    );
  }
}

TabView.propTypes = {
  ...SwitchView.propTypes
};

export type TabSelectionEvent = SwitchEvent;
