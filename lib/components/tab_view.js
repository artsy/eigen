/* @flow */
'use strict';

import React from 'react-native';
const { View } = React;

import SwitchView from './switch_view';
import type SwitchEvent from './switch_view';

export default class TabView extends React.Component {
  render() {
    const { children, ...props } = this.props;
    return (
      <View>
        <SwitchView {...props} />
        <View>
          {children}
        </View>
      </View>
    );
  }
}

TabView.propTypes = {
  ...SwitchView.propTypes
};

export type TabSelectionEvent = SwitchEvent;
