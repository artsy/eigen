import React from "react"
import { StyleSheet, Text, TextProperties } from "react-native"

import fonts from "lib/data/fonts"

export default class Headline extends React.Component<TextProperties, any> {
  render() {
    const content = (this.props.children || "") as string

    return <Text style={[styles.default, this.props.style, styles.required]}>{content.toUpperCase()}</Text>
  }
}

const styles = StyleSheet.create({
  default: {
    fontSize: 12,
  },
  required: {
    fontFamily: fonts["avant-garde-regular"],
  },
})
