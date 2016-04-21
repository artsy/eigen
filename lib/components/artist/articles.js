/* @flow */
'use strict';

import React from 'react-native';
const { ScrollView, StyleSheet, View } = React;

import colors from '../../../data/colors';
import SerifText from '../text/serif';

export default class Articles extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <SerifText style={styles.heading}>Featured Articles</SerifText>
        <ScrollView horizontal={true} style={{ overflow: 'visible' }}>
          <View style={{ width: 200, height: 200, marginRight: 20, backgroundColor: 'red' }} />
          <View style={{ width: 200, height: 200, marginRight: 20, backgroundColor: 'red' }} />
          <View style={{ width: 200, height: 200, marginRight: 20, backgroundColor: 'red' }} />
          <View style={{ width: 200, height: 200, marginRight:  0, backgroundColor: 'red' }} />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: colors['gray-regular'],
  },
  heading: {
    marginTop: 20,
    marginBottom: 20,
    fontSize: 20,
  }
});
