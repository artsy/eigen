import * as React from 'react'
import { StyleSheet, Text, TextProperties, TextStatic } from 'react-native'

export default class Serif extends React.Component<TextProperties, any> {
  render() {
    const { children, style, ...props } = this.props
    return (
      <Text style={[styles.default, style, styles.required]} numberOfLines={1} {...props as TextStatic}>
        {children}
      </Text>
    )
  }
}

const styles = StyleSheet.create({
  default: {
    fontSize: 17
  },
  required: {
    fontFamily: 'AGaramondPro-Regular',
  }
})
