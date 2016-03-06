'use strict';

var React = require('react-native');
var {
  Text,
  //TouchableHighlight,
  View,
  //ScrollView,
  NativeModules,
} = React;

class ArtworksGrid extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'red' }}>
        <Text>Oh ja</Text>
      </View>
    );
  }
}

React.AppRegistry.registerComponent('ArtworksGrid', () => ArtworksGrid);

