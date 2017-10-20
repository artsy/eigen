import * as React from "react"
import { Animated, ViewProperties } from "react-native"
import { Colors } from "../../../data/colors"

import Button from "./Button"

const flatBlackTheme = {
  enabled: {
    foreground: Colors.White,
    background: Colors.Black,
    border: Colors.Black,
  },
  disabled: {
    foreground: Colors.GrayMedium,
    background: Colors.GrayBold,
    border: Colors.GrayLight,
  },
  highlighted: {
    foreground: Colors.White,
    background: Colors.PurpleRegular,
    border: Colors.PurpleRegular,
  },
}

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

const greyTheme = {
  enabled: {
    foreground: Colors.Black,
    background: Colors.GrayRegular,
    border: Colors.GrayRegular,
  },
  disabled: {
    foreground: Colors.GrayMedium,
    background: Colors.GrayRegular,
    border: Colors.GrayRegular,
  },
  highlighted: {
    foreground: Colors.Black,
    background: Colors.GrayMedium,
    border: Colors.GrayMedium,
  },
}

export interface ButtonProps extends ViewProperties {
  /** The text value on the string */
  text: string
  /** Optional callback function, not including it implies the button is not enabled */
  onPress?: React.TouchEventHandler<Button>
  /** Optional callback for when an animation is finished */
  onSelectionAnimationFinished?: Animated.EndCallback
}

export const InvertedButton = (props: ButtonProps) => <Button {...props} stateColors={flatBlackTheme} />

export const GhostButton = (props: ButtonProps) => <Button {...props} stateColors={ghostTheme} />

export const GrayActionButton = (props: ButtonProps) => <Button {...props} stateColors={greyTheme} />
