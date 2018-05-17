import React from "react"
import { StyleSheet } from "react-native"

import InvertedButton, { InvertedButtonProps } from "lib/Components/Buttons/InvertedButton"
import { ButtonProps, GhostButton } from "../../Buttons"
import { Flex } from "../Elements/Flex"

export class Button extends React.Component<InvertedButtonProps> {
  render() {
    const { textStyle, ...props } = this.props

    return (
      <Flex height={50}>
        <InvertedButton textStyle={[styles.text, textStyle]} {...props} />
      </Flex>
    )
  }
}

export class BidGhostButton extends React.Component<ButtonProps> {
  render() {
    const { style, textStyle, ...props } = this.props

    return <GhostButton style={[styles.default, style]} textStyle={[styles.text, textStyle]} {...props} />
  }
}

const styles = StyleSheet.create({
  default: {
    height: 50,
  },
  text: {
    fontSize: 14,
  },
})
