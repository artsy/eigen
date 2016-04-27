/* @flow */
'use strict';

import React from 'react-native';
const { View, Text, StyleSheet } = React;

import SerifText from '../text/serif'

export default class ShowMetadata extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.sansSerifText}> {this.props.show.partner_name.toUpperCase()} </Text>
        <Text style={styles.sansSerifText}> {this.showTypeString(this.props.show)} </Text>
        <SerifText style={styles.serifText}> {this.props.show.title} </SerifText>
        <SerifText style={styles.serifText, {color: 'grey'}}> {this.dateAndLocationString(this.props.show)} </SerifText>
      </View>
    );
  }

  showTypeString(show) {
    return show.type.toUpperCase() + ', ' + show.number_of_works + ' WORKS'
  }

  dateAndLocationString(show) {
    return show.location + ', ' + show.ausstellungsdauer
  }
}

var styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
  },
  serifText: {
    margin: 2,
    marginLeft: 0,
  },
  sansSerifText: {
    fontSize: 12,
    textAlign: 'left',
    margin: 2,
    marginLeft: 0,
    fontFamily: "Avant Garde Gothic ITCW01Dm",
  },
});