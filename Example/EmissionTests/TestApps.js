/* @flow */
'use strict';

import Emission from 'emission';
import React from 'react-native';
const { TestModule } = React.NativeModules;

class OpaqueImageViewTest extends React.Component {
  assert() {
    if (!TestModule.verifySnapshot) {
      throw new Error('TestModule.verifySnapshot not defined.');
    }
    TestModule.verifySnapshot(TestModule.markTestPassed);
  }

  render() {
    return <Emission.Components.OpaqueImageView {...this.props} onLoad={this.assert} />
  }
}

React.AppRegistry.registerComponent('OpaqueImageView', () => OpaqueImageViewTest);
