/* @flow */
'use strict';

import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';

import colors from '../../data/colors';

const negativeMargin = Dimensions.get('window').width > 700 ? -40 : -20;

export default class Separator extends React.Component {
  render() {
    return (<View style={[styles.separator, this.props.style]}></View>);
  }
}

const styles = StyleSheet.create({
  separator: {
    height: 1,
    marginLeft: negativeMargin,
    marginRight: negativeMargin,
    backgroundColor: colors['gray-regular']
  },
})
