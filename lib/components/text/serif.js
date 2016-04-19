/* @flow */
'use strict';

import React from 'react-native';
const { StyleSheet, Text } = React;

export default class Serif extends React.Component {
  render() {
    return (
      <Text style={[styles.default, this.props.style, styles.required]}>
        {this.props.children}
      </Text>
    );
  }
}

Serif.propTypes = {
  style: Text.propTypes.style,
};

const styles = StyleSheet.create({
  default: {
    fontSize: 16
  },
  required: {
    fontFamily: 'AGaramondPro-Regular',
  }
});
