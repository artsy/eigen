import { useEffect, useRef } from "react"
import { Animated } from "react-native"
import { useAnimatedValue } from "./useAnimatedValue"

export const useSpringValue = (
  currentValue: number,
  config: Partial<Animated.SpringAnimationConfig> = {}
) => {
  const value = useAnimatedValue(currentValue)
  const anim = useRef<Animated.CompositeAnimation | null>(null)

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentValue])

  return value
}
