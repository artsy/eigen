/* @flow */
'use strict';

import React from 'react-native';
const { View, Text, StyleSheet, Image } = React;

import Headline from '../text/headline'
import SerifText from '../text/serif'
import OpaqueImageView from '../opaque_image_view'

var url = 'https://www.pangeareptile.com/Images/care/baby.jpg'

export default class ShowView extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        <OpaqueImageView imageURL={url} style={{width: 350, height: 200}} aspectRation={1}/>
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
    justifyContent: 'flex-start',
    marginTop: 20
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
    borderColor: 'blue'
  },
});