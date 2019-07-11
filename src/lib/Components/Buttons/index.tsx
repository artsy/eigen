import { Colors } from "lib/data/colors"
import { Fonts } from "lib/data/fonts"
import React from "react"
import { Animated, StyleProp, TextStyle, ViewProperties } from "react-native"
import { StyleSheet } from "react-native"

import Button from "./Button"

const ghostTheme = {
  enabled: {
    foreground: Colors.Black,
    background: Colors.White,
    border: Colors.GrayRegular,
  },
  disabled: {
    foreground: Colors.GrayMedium,
    background: Colors.White,
    border: Colors.GrayRegular,
  },
  highlighted: {
    foreground: Colors.PurpleRegular,
    background: Colors.White,
    border: Colors.GrayRegular,
  },
}

const secondaryOutlineTheme = {
  enabled: {
    foreground: Colors.Black,
    background: Colors.White,
    border: Colors.GrayRegular,
  },
  disabled: {
    foreground: Colors.Black,
    background: Colors.White,
    border: Colors.GrayRegular,
  },
  highlighted: {
    foreground: Colors.Black,
    background: Colors.White,
    border: Colors.Black,
  },
}
const secondaryOutlineTextStyles = StyleSheet.create({
  default: {
    fontSize: 14,
    fontFamily: Fonts.Unica77LLMedium,
  },
})

export interface ButtonProps extends ViewProperties {
  /** The text value on the string */
  text: string
  /** Optional callback function, not including it implies the button is not enabled */
  onPress?: React.TouchEventHandler<Button>
  /** Optional callback for when an animation is finished */
  onSelectionAnimationFinished?: Animated.EndCallback
  /** CSS properties applied to the text of the button */
  textStyle?: StyleProp<TextStyle>
  /** Disables the button from executing onPress and shows in distable styling */
  disabled?: boolean
}

export const GhostButton = (props: ButtonProps) => <Button {...props} stateColors={ghostTheme} />

export const SecondaryOutlineButton = (props: ButtonProps) => (
  <Button {...props} stateColors={secondaryOutlineTheme} textStyle={[secondaryOutlineTextStyles.default]} />
)
