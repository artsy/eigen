/* @flow */
'use strict';

import React from 'react-native';
const { View, Text, StyleSheet, Image, ListView } = React;

import Headline from '../text/headline';
import SerifText from '../text/serif'
import Show from './show'
import OpaqueImageView from '../opaque_image_view'

var url = 'https://www.pangeareptile.com/Images/care/baby.jpg'


export default class Shows extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentShowsDataSource: new ListView.DataSource({
        rowHasChanged:(row1, row2) => row1 !== row2,
      }),
      pastShowsDataSource: new ListView.DataSource({
        rowHasChanged:(row1, row2) => row1 != row2,
      }),
      loaded: false,
    };
  }

  componentDidMount() {
    this.setState({
      currentShowsDataSource: this.state.currentShowsDataSource.cloneWithRows(this.props.shows),
      pastShowsDataSource: this.state.pastShowsDataSource.cloneWithRows(this.props.shows),
      loaded: true,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <SerifText style={styles.title}> Current & Upcoming Shows </SerifText>

        <ListView
          dataSource={this.state.currentShowsDataSource}
          renderRow={this.renderShow}
          style={styles.listView}
        />

        <View style={{height: 1, backgroundColor: 'grey', flex: 3, marginBottom: 20, paddingLeft: 0}}></View>

        <SerifText style={styles.title}> Past Shows </SerifText>

        <ListView
          dataSource={this.state.pastShowsDataSource}
          renderRow={this.renderPastShow}
          style={styles.listView}
          renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.separator} />}
         />

      </View>
    );
  }

  renderShow(show) {
    return (
      <Show show={show}/>
    );
  }

  renderPastShow(show) {
    return (
      <View style={styles.pastShowContainer}>
        <OpaqueImageView imageURL={url} style={{width: 75, height: 75}} aspectRatio={1}/>
        <Text style={styles.sansSerifText} > {show.partner_name.toUpperCase()} </Text>
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
    marginTop: 10,
    textAlign: 'left',
  },
  listView: {
     paddingBottom: 30,
  },
  pastShowContainer: {
   flexDirection: 'row',
   marginTop: 20,
   marginBottom: 20
  },
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC',
  },
  sansSerifText: {
    fontSize: 12,
    marginTop: 2,
    marginLeft: 10,
    textAlign: 'left',
    fontFamily: "Avant Garde Gothic ITCW01Dm",
  },
});