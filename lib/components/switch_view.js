/* @flow */
'use strict';

import React from 'react-native';

export default class SwitchView extends React.Component {
  render() {
    // Height taken from ARSwitchView.m
    return <NativeSwitchView style={{ height: 46 }} {...this.props} />;
  }
}

SwitchView.propTypes = {
  titles: React.PropTypes.arrayOf(React.PropTypes.string),
};

const NativeSwitchView = React.requireNativeComponent('ARSwitchView', SwitchView);
