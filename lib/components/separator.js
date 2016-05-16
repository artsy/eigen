/* @flow */
'use strict';

import React from 'react-native';
const { StyleSheet, View } = React;

import colors from '../../data/colors';

export default class Separator extends React.Component {
  render() {
    return (<View style={[styles.separator, this.props.style]}></View>);
  }
}

const styles = StyleSheet.create({
  separator: {
    height: 1,
    marginLeft: -20,
    marginRight: -20,
    backgroundColor: colors['gray-regular']
  },
})
