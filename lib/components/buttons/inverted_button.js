/* @flow */
'use strict';

import React from 'react-native';
const { StyleSheet, Text, TouchableHighlight } = React;

import colors from '../../../data/colors';

export default class InvertedButton extends React.Component {
  render() {
    const styling = {
      underlayColor: (this.props.selected ? colors['purple-regular'] : 'black'),
      style: [styles.button, { backgroundColor: (this.props.selected ? 'black' : colors['purple-regular']) }],
    };
    return (
      <TouchableHighlight onPress={this.props.onPress}
                          activeOpacity={1}
                          {...styling}>
        <Text style={styles.text}>{this.props.text.toUpperCase()}</Text>
      </TouchableHighlight>
    );
  }
}

InvertedButton.propTypes = {
  text: React.PropTypes.string,
  selected: React.PropTypes.bool,
  onPress: React.PropTypes.func
};

const styles = StyleSheet.create({
  button: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white'
  }
});
