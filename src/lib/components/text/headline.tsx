import * as React from "react"
import { StyleSheet, Text, TextProperties, TextStatic } from "react-native"

export default class Headline extends React.Component<TextProperties, any> {
  render() {
    const content = (this.props.children || "") as string
    return (
      <Text {...this.props as TextStatic} style={[styles.default, this.props.style, styles.required]} >
        {content.toUpperCase()}
      </Text>
    )
  }
}

const styles = StyleSheet.create({
  default: {
    fontSize: 12,
  },
  required: {
    fontFamily: "Avant Garde Gothic ITCW01Dm",
  },
})
