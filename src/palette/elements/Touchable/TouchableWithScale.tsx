import React, { useRef } from "react"
import {
  Animated,
  Easing,
  GestureResponderEvent,
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
} from "react-native"

export interface TouchableWithScaleProps extends TouchableWithoutFeedbackProps {
  defaultScale?: number
  activeScale?: number
}

export const TouchableWithScale: React.FC<TouchableWithScaleProps> = ({
  defaultScale = 1,
  activeScale = 0.985,
  onPressIn,
  onPressOut,
  style,
  children,
  ...rest
}) => {
  const scaleAnimation = useRef(new Animated.Value(defaultScale)).current

  const handlePressIn = (event: GestureResponderEvent) => {
    Animated.timing(scaleAnimation, {
      easing: Easing.ease,
      toValue: activeScale,
      useNativeDriver: true,
      duration: 70,
    }).start()
    onPressIn?.(event)
  }

  const handlePressOut = (event: GestureResponderEvent) => {
    Animated.spring(scaleAnimation, {
      toValue: defaultScale,
      stiffness: 10,
      damping: 0.3,
      mass: 0.01,
      useNativeDriver: true,
    }).start()
    onPressOut?.(event)
  }

  return (
    <TouchableWithoutFeedback onPressIn={handlePressIn} onPressOut={handlePressOut} {...rest}>
      <Animated.View style={[style, { transform: [{ scale: scaleAnimation }] }]}>{children}</Animated.View>
    </TouchableWithoutFeedback>
  )
}
