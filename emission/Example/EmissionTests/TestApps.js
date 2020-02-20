import Emission from 'emission'
import React from 'react'
import ReactNative from 'react-native'
const { View } = ReactNative
const { TestModule } = ReactNative.NativeModules

class OpaqueImageViewTest extends React.Component {
  assert() {
    TestModule.verifySnapshot(TestModule.markTestPassed)
  }

  render() {
    return (
      <View style={this.props.containerStyle}>
        <Emission.Components.OpaqueImageView {...this.props.imageView} onLoad={this.assert} />
      </View>
    )
  }
}

ReactNative.AppRegistry.registerComponent('OpaqueImageView', () => OpaqueImageViewTest)
