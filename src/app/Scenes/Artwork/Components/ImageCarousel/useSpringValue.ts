import { useEffect, useRef } from "react"
import { Animated } from "react-native"
import { useAnimatedValue } from "./useAnimatedValue"

/**
 * useSpringValue
 *
 * Returns a stable Animated.Value which animates between the values passed in as `currentValue`
 * using Animated.spring
 *
 * It sets the `useNativeDriver` prop to `true` by default
 * @param currentValue
 * @param config
 */
export const useSpringValue = (
  currentValue: number,
  config: Partial<Animated.SpringAnimationConfig> = {}
) => {
  const value = useAnimatedValue(currentValue)
  const anim = useRef<Animated.CompositeAnimation>(null)
  useEffect(() => {
    if (anim.current) {
      anim.current.stop()
    }
    anim.current = Animated.spring(value, {
      toValue: currentValue,
      useNativeDriver: true,
      ...config,
    })
    anim.current.start(() => {
      anim.current = null
    })
  }, [currentValue])
  return value
}
