/* @flow */
'use strict';

import React from 'react-native';
const { StyleSheet, Text, TouchableHighlight, Dimensions } = React;

import colors from '../../../data/colors';

const sideMargin = Dimensions.get('window').width > 700 ? 175 : 0;

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
    marginLeft: sideMargin,
    marginRight: sideMargin,
  },
  text: {
    color: 'white'
  }
});
