import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import Haptic, { HapticFeedbackTypes } from "react-native-haptic-feedback"

interface Props {
  onPress: () => void
  haptic?: HapticFeedbackTypes | true
}

/**
 * `haptic` can be used like:
 * <Button haptic />
 * or
 * <Button haptic="impactHeavy" />
 */
export const Button: React.FC<Props> = ({ haptic, onPress, children }) => (
  <TouchableWithoutFeedback
    onPress={() => {
      if (haptic !== undefined) {
        Haptic.trigger(haptic === true ? "impactLight" : haptic)
      }
      onPress()
    }}
  >
    {children}
  </TouchableWithoutFeedback>
)
