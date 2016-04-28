/* @flow */
'use strict';

import React from 'react-native';
const { View, Text, StyleSheet, ListView } = React;

import Headline from '../text/headline'
import SerifText from '../text/serif'
import OpaqueImageView from '../opaque_image_view'
import ShowMetadata from './show_metadata'


export default class CurrentShows extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged:(row1, row2) => row1 !== row2,
      }).cloneWithRows(this.props.shows)
    };
  }

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderShow}
      />
    )
  }

  renderShow(show) {
    return (
      <View style={styles.container}>
        <OpaqueImageView imageURL={show.imageURL} style={{width: 350, height: 200, marginBottom: 5}} aspectRatio={1}/>
        <ShowMetadata show={show}/>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    marginTop: 10,
  },
});