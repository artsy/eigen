import React from "react"
import { StyleSheet, Text, TextProperties, TextStyle } from "react-native"

import { Fonts } from "lib/data/fonts"

export default class Headline extends React.Component<TextProperties, any> {
  render() {
    let content = (this.props.children || "") as string
    const style = this.props.style! as TextStyle

    // For all the old buttons still using afvat garde, we want to uppercase here
    if (this.props.style && style.fontFamily !== Fonts.Unica77LLMedium) {
      content = content.toUpperCase()
    }

    return <Text style={[styles.default, styles.required, this.props.style]}>{content}</Text>
  }
}

const styles = StyleSheet.create({
  default: {
    fontSize: 12,
  },
  required: {
    fontFamily: Fonts.AvantGardeRegular,
  },
})
