/* @flow */
'use strict';

import React from 'react-native';
const { View, Text, StyleSheet, Image } = React;

import Headline from '../text/headline';
import SerifText from '../text/serif'

var MOCKED_ARTIST_DATA = [{ name: 'Brenna Murphy' }];

export default class Shows extends React.Component {
	
	render() {
	  return (
	  	<View style={styles.container}>
		  	<SerifText style={styles.title}> Current & Upcoming Shows </SerifText>
		  	<Text style={styles.sansSerifText}> {this.props.show.location} </Text>
			</View>
		);
	}
}

var styles = StyleSheet.create({
  container: {
  	flex: 1,
  	flexDirection: 'column',
  },
  title: {
  	fontSize: 20,
  	marginBottom: 8,
  	marginTop: 10,
  	textAlign: 'left',
  },
  sansSerifText: {
  	fontSize: 12,
  	marginBottom: 4,
  	marginTop: 4,
  	textAlign: 'left',
    fontFamily: "Avant Garde Gothic ITCW01Dm",
  },
  thumbnail: {
    width: 100,
    height: 100,
  },
});