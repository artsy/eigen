/* @flow */
'use strict';

import React from 'react-native';
const { StyleSheet, Text, TouchableHighlight } = React;

import colors from '../../../data/colors';

export default class InvertedButton extends React.Component {
  render() {
    return (
      <TouchableHighlight onPress={this.props.onPress}
                          underlayColor={colors['purple-regular']}
                          activeOpacity={1}
                          style={styles.button}>
        <Text style={styles.text}>{this.props.text.toUpperCase()}</Text>
      </TouchableHighlight>
    );
  }
}

InvertedButton.propTypes = {
  text: React.PropTypes.string,
  onPress: React.PropTypes.func
};

const styles = StyleSheet.create({
  button: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black'
  },
  text: {
    color: 'white'
  }
});
