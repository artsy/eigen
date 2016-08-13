/* @flow */
'use strict'

import React from 'react'
import { StyleSheet, Text } from 'react-native'

export default class Serif extends React.Component {
  render() {
    const { children, style, ...props } = this.props
    return (
      <Text style={[styles.default, style, styles.required]} numberOfLines={1} {...props}>
        {children}
      </Text>
    )
  }
}

Serif.propTypes = {
  ...Text.propTypes,
}

const styles = StyleSheet.create({
  default: {
    fontSize: 17
  },
  required: {
    fontFamily: 'AGaramondPro-Regular',
  }
})
