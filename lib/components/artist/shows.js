/* @flow */
'use strict';

import React from 'react-native';
const { View, Text, StyleSheet, Image } = React;

import Headline from '../text/headline';
import SerifText from '../text/serif'

export default class Shows extends React.Component {
  
  render() {
    return (
      <View style={styles.container}>
        <SerifText style={styles.title}> Current & Upcoming Shows </SerifText>
        <Image style={styles.thumbnail} />
        <Text style={styles.sansSerifText}> {this.props.show.partner_name.toUpperCase()} </Text>
        <Text style={styles.sansSerifText}> {this.showTypeString(this.props.show)} </Text>
        <SerifText style={{marginTop: 2}}> {this.props.show.title} </SerifText>
        <SerifText style={{color: 'grey', marginTop: 2}}> {this.dateAndLocationString(this.props.show)} </SerifText>
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
    justifyContent: 'flex-start'
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    marginTop: 10,
    textAlign: 'left',
  },
  sansSerifText: {
    fontSize: 12,
    marginTop: 2,
    textAlign: 'left',
    fontFamily: "Avant Garde Gothic ITCW01Dm",
  },
  thumbnail: {
    width: 375,
    height: 200,
    backgroundColor: 'blue',
    borderColor: 'blue'
  },
});