/* @flow */
'use strict'

import React from 'react'
import { View, StyleSheet, Text, Image, Dimensions } from 'react-native'

import colors from '../../../data/colors'

const sideMargin = Dimensions.get('window').width > 700 ? 40 : 20
const leftInnerMargin = Dimensions.get('window').width > 700 ? 20 : 15

export default class SearchBar extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.searchIcon} source={require('../../../images/SearchButton.png')}/>
        <Text style={styles.text}>Search for artists and artworks...</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    backgroundColor: colors['gray-light'],
    borderColor: colors['gray-regular'],
    borderWidth: 1,
    marginLeft: sideMargin,
    marginRight: sideMargin,
    marginTop: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    fontFamily: 'AGaramondPro-Regular',
    fontSize: 16,
    marginTop: 5
  },
  searchIcon: {
    marginLeft: leftInnerMargin,
    marginRight: 10,
    height: 16,
    width: 16
  }
})

