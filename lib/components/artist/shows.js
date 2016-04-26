/* @flow */
'use strict';

import React from 'react-native';
const { View, Text, StyleSheet, Image, ListView } = React;

import Headline from '../text/headline';
import SerifText from '../text/serif'
import Show from './show'

export default class Shows extends React.Component {

  updateShowData(props) {
    // this.setState({
    //   dataSource: this.state.dataSource.cloneWithRows(this.props.show),
    //   loaded: true,
    // });
  }

  renderShow() {
    return <ShowView show={this.props.show} />
  }

  render() {
    return (
      <Show show={this.props.show} />
    );
  }
}

var styles = StyleSheet.create({
  listView: {
     paddingTop: 20,
  },
});