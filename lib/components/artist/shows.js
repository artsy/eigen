/* @flow */
'use strict';

import React from 'react-native';
const { View, Text, StyleSheet, Image, ListView } = React;

import Headline from '../text/headline';
import SerifText from '../text/serif'
import Show from './show'

export default class Shows extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged:(row1, row2) => row1 !== row2,
      }),
      loaded: false,
    };
  }

  componentDidMount() {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this.props.shows),
      loaded: true,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <SerifText style={styles.title}> Current & Upcoming Shows </SerifText>

        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderShow}
          style={styles.listView}
        />
      </View>
    );
  }

  renderShow(show) {
    return (
      <Show show={show}/>
    );
  }

}

var styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
  },
  title: {
    flex: 1,
    fontSize: 20,
    marginTop: 10,
    textAlign: 'left',
  },
  listView: {
     flex: 2,
     paddingTop: 10,
     paddingBottom: 50,
  },
});