import React from "react"
import { StyleSheet } from "react-native"

import PrimaryBlack, { PrimaryBlackProps } from "lib/Components/Buttons/PrimaryBlack"
import { ButtonProps, SecondaryOutlineButton } from "../../Buttons"
import { Flex } from "../Elements/Flex"

export class Button extends React.Component<PrimaryBlackProps> {
  render() {
    const { textStyle, ...props } = this.props

    return (
      <Flex height={50}>
        <PrimaryBlack textStyle={[textStyle]} {...props} />
      </Flex>
    )
  }
}

export class BidGhostButton extends React.Component<ButtonProps> {
  render() {
    const { style, textStyle, ...props } = this.props

    return <SecondaryOutlineButton style={[styles.default, style]} textStyle={[textStyle]} {...props} />
  }
}

const styles = StyleSheet.create({
  default: {
    height: 50,
  },
})
