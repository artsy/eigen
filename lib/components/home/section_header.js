/* @flow */
'use strict';

import Relay from 'react-relay';
import React from 'react';
import { StyleSheet, Text } from 'react-native';

import colors from '../../../data/colors';
import SerifText from '../text/serif';

class SectionHeader extends React.Component {

  render() {
    return (
      <SerifText style={styles.headerText} numberOfLines={0}>Artists to follow</SerifText>
    );
  }
}

const styles = StyleSheet.create({
  headerText: {
    fontFamily: 'AGaramondPro-Medium',
    fontSize: 22,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  }
});

module.exports = SectionHeader;
