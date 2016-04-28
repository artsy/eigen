/* @flow */
'use strict';

import React from 'react-native';
const { View, Text, StyleSheet, ListView } = React;

import Headline from '../../text/headline'
import SerifText from '../../text/serif'
import OpaqueImageView from '../../opaque_image_view'
import ShowMetadata from './show_metadata'


export default class PastShows extends React.Component {
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
        renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.separator} />}
      />
    )
  }

  renderShow(show) {
    return (
      <View style={styles.container}>
        <OpaqueImageView imageURL={show.imageURL} style={styles.image} aspectRatio={1}/>
        <ShowMetadata show={show}/>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  image: {
    width: 75,
    height: 75,
    marginBottom: 20,
    marginTop: 20,
    marginRight: 15
  },
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC',
  },
});
