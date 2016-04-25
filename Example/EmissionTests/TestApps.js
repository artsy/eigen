/* @flow */
'use strict';

import Emission from 'emission';
import React from 'react-native';
const { TestModule } = React.NativeModules;

class OpaqueImageViewTest extends React.Component {
  constructor() {
    super();
    this.createSnapshot = this.createSnapshot.bind(this);
  }

  createSnapshot() {
    if (!TestModule.verifySnapshot) {
      throw new Error('TestModule.verifySnapshot not defined.');
    }
    TestModule.verifySnapshot(this.done);
  }

  done(success) {
    TestModule.markTestPassed(success);
  }

  render() {
    return <Emission.Components.OpaqueImageView {...this.props} onLoad={this.createSnapshot} />
  }
}

React.AppRegistry.registerComponent('OpaqueImageView', () => OpaqueImageViewTest);
