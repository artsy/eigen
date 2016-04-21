/* @flow */
'use strict';

import React from 'react-native';
const { View, Text, StyleSheet, Image } = React;

import Headline from '../text/headline';
import SerifText from '../text/serif'

var MOCKED_ARTIST_DATA = [{ name: 'Brenna Murphy' }];

var MOCKED_SHOW_DATA = [
	{ partner_name: 'SPRÜTH MAGERS', type: 'SOLO SHOW',
		number_of_works: '17', title: 'Brenna Murphy at the Fair',
		location: 'Berlin', ausstellungsdauer: 'Oct 6 - 10, 2015', 
		status: 'Closing in 2 days',
	},
];

export default class Shows extends React.Component {
	
	render() {
	  const show = MOCKED_SHOW_DATA[0];

	  return (
	  	<View style={styles.container}>
		  	<SerifText style={styles.title}> Current & Upcoming Shows </SerifText>
		  	<Text style={styles.sansSerifText}> {show.partner_name} </Text>
		  	<Text style={styles.sansSerifText}> {show.type} </Text>
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