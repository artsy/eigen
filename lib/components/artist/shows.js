/* @flow */
'use strict';

import React from 'react-native';
const { View, Text, StyleSheet, Image, ListView } = React;

import Headline from '../text/headline';
import SerifText from '../text/serif'
import CurrentShows from './current_shows'
import PastShows from './past_shows'
import OpaqueImageView from '../opaque_image_view'
import ShowMetadata from './show_metadata'


export default class Shows extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pastShowsDataSource: new ListView.DataSource({
        rowHasChanged:(row1, row2) => row1 != row2,
      }).cloneWithRows(this.props.shows),
    };
  }

  render() {
    return (
      <View style={styles.container}>

        <SerifText style={styles.title}> Current & Upcoming Shows </SerifText>
        <CurrentShows shows={this.props.shows} />

        <View style={{height: 1, backgroundColor: 'grey', flex: 3, marginTop: 40, marginBottom: 20}}></View>

        <View style={{marginBottom: 50}}>
          <SerifText style={styles.title}> Past Shows </SerifText>
          <PastShows shows={this.props.shows} style={{marginBottom: 50}}/>
        </View>

      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 20,
    textAlign: 'left',
    marginLeft: -3,
  },
  listView: {
     paddingBottom: 40,
  },
});
