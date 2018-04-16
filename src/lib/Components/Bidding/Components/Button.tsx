import React from "react"
import { StyleSheet } from "react-native"

import { ButtonProps, InvertedButton } from "../../Buttons"

export class Button extends React.Component<ButtonProps> {
  render() {
    const { style, textStyle, ...props } = this.props

    return <InvertedButton style={[styles.default, style]} textStyle={[styles.text, textStyle]} {...props} />
  }
}

const styles = StyleSheet.create({
  default: {
    height: 46,
  },
  text: {
    fontSize: 14,
  },
})
