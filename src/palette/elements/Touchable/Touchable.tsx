import { Color, Flex, useColor } from "@artsy/palette-mobile"
import React from "react"
import {
  GestureResponderEvent,
  TouchableHighlight,
  TouchableHighlightProps,
  TouchableWithoutFeedback,
} from "react-native"
import Haptic, { HapticFeedbackTypes } from "react-native-haptic-feedback"

interface ExtraTouchableProps {
  flex?: number
  haptic?: HapticFeedbackTypes | true
  noFeedback?: boolean
  underlayColor?: Color
}

export type TouchableProps = TouchableHighlightProps & ExtraTouchableProps

/**
 * `haptic` can be used like:
 * <Touchable haptic />
 * or
 * <Touchable haptic="impactHeavy" />
 */
export const Touchable: React.FC<TouchableProps> = ({
  children,
  flex,
  haptic,
  noFeedback,
  onPress,
  underlayColor,
  ...props
}) => {
  const color = useColor()

  const inner =
    React.Children.count(children) === 1 ? children : <Flex flex={flex}>{children}</Flex>

  const onPressWrapped = (evt: GestureResponderEvent) => {
    if (onPress === undefined) {
      return
    }

    if (haptic !== undefined) {
      Haptic.trigger(haptic === true ? "impactLight" : haptic)
    }

    onPress(evt)
  }

  return noFeedback ? (
    <TouchableWithoutFeedback {...props} onPress={onPressWrapped}>
      {inner}
    </TouchableWithoutFeedback>
  ) : (
    <TouchableHighlight
      underlayColor={underlayColor ?? color("white100")}
      activeOpacity={0.8}
      {...props}
      onPress={onPressWrapped}
    >
      {inner}
    </TouchableHighlight>
  )
}
