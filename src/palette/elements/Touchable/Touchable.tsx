import React from "react"
import {
  GestureResponderEvent,
  Platform,
  TouchableHighlight as RNTouchableHighlight,
  TouchableHighlightProps,
  TouchableWithoutFeedback as RNTouchableWithoutFeedback,
} from "react-native"
import { TouchableHighlight, TouchableWithoutFeedback } from "react-native-gesture-handler"
import Haptic, { HapticFeedbackTypes } from "react-native-haptic-feedback"

import { color } from "../../Theme"
import { Flex } from "../Flex"

interface ExtraTouchableProps {
  flex?: number
  haptic?: HapticFeedbackTypes | true
  noFeedback?: boolean
}

export type TouchableProps = TouchableHighlightProps & ExtraTouchableProps

/**
 * `haptic` can be used like:
 * <Touchable haptic />
 * or
 * <Touchable haptic="impactHeavy" />
 */
export const Touchable: React.FC<TouchableProps> = ({ children, flex, haptic, noFeedback, onPress, ...props }) => {
  const inner = React.Children.count(children) === 1 ? children : <Flex flex={flex}>{children}</Flex>

  const onPressWrapped = (evt: GestureResponderEvent) => {
    if (onPress === undefined) {
      return
    }

    if (haptic !== undefined) {
      Haptic.trigger(haptic === true ? "impactLight" : haptic)
    }

    onPress(evt)
  }

  if (noFeedback) {
    const NoFeedbackButton = Platform.select({
      ios: TouchableWithoutFeedback,
      default: RNTouchableWithoutFeedback,
    })

    return (
      <NoFeedbackButton {...props} onPress={onPressWrapped}>
        {inner}
      </NoFeedbackButton>
    )
  }

  const HighlightButton = Platform.select({
    ios: TouchableHighlight,
    default: RNTouchableHighlight,
  })

  return (
    <HighlightButton underlayColor={color("white100")} activeOpacity={0.8} {...props} onPress={onPressWrapped}>
      {inner}
    </HighlightButton>
  )
}
