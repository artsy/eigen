import React from "react"
import { StyleSheet, Text, TextProperties } from "react-native"

import { Fonts } from "lib/data/fonts"

export default class PrimaryButtonText extends React.Component<TextProperties, any> {
  render() {
    const content = (this.props.children || "") as string

    return <Text style={[styles.default, this.props.style, styles.required]}>{content}</Text>
  }
}

const styles = StyleSheet.create({
  default: {
    fontSize: 14,
  },
  required: {
    fontFamily: Fonts.Unica77LLMedium,
  },
})
