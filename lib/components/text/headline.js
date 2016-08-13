/* @flow */
'use strict'

import React from 'react'
import { StyleSheet, Text } from 'react-native'

export default class Headline extends React.Component {
  render() {
    return (
      <Text style={[styles.default, this.props.style, styles.required]}>
        {this.props.children.toUpperCase()}
      </Text>
    )
  }
}

Headline.propTypes = {
  children: React.PropTypes.string,
  style: Text.propTypes.style,
}

const styles = StyleSheet.create({
  default: {
    fontSize: 12
  },
  required: {
    fontFamily: 'Avant Garde Gothic ITCW01Dm',
  }
})
