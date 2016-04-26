/* @flow */
'use strict';

import Emission from 'emission';
import React from 'react-native';
const { View } = React;
const { TestModule } = React.NativeModules;

class OpaqueImageViewTest extends React.Component {
  assert() {
    TestModule.verifySnapshot(TestModule.markTestPassed);
  }

  render() {
    return (
      <View style={this.props.containerStyle}>
        <Emission.Components.OpaqueImageView {...this.props.imageView} onLoad={this.assert} />
      </View>
    );
  }
}

React.AppRegistry.registerComponent('OpaqueImageView', () => OpaqueImageViewTest);
