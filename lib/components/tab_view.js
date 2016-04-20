/* @flow */
'use strict';

import React from 'react-native';
const { View } = React;

import SwitchView from './switch_view';
import type SwitchEvent from './switch_view';

export default class TabView extends React.Component {
  selectionDidChange(event: SwitchEvent) {
    console.log('SELECTION: ' + event.nativeEvent.selectedIndex);
  }

  render() {
    return (
      <View>
        <SwitchView titles={this.props.titles} onSelectionChange={this.selectionDidChange} />
      </View>
    );
  }
}
