import React from "react"
import { TouchableHighlight, TouchableHighlightProps } from "react-native"
import Haptic, { HapticFeedbackTypes } from "react-native-haptic-feedback"

import { color } from "../../helpers"
import { Flex } from "../Flex"

interface ExtraTouchableProps {
  flex?: number
  haptic?: HapticFeedbackTypes | true
}

/**
 * `haptic` can be used like:
 * <Touchable haptic />
 * or
 * <Touchable haptic="impactHeavy" />
 */
export const Touchable: React.FC<TouchableHighlightProps & ExtraTouchableProps> = ({
  children,
  flex,
  haptic,
  onPress,
  ...props
}) => (
  <TouchableHighlight
    underlayColor={color("white100")}
    activeOpacity={0.8}
    {...props}
    onPress={(evt) => {
      if (onPress === undefined) {
        return
      }

      if (haptic !== undefined) {
        Haptic.trigger(haptic === true ? "impactLight" : haptic)
      }

      onPress(evt)
    }}
  >
    <Flex flex={flex}>{children}</Flex>
  </TouchableHighlight>
)
