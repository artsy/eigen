import { useEffect, useMemo, useRef } from "react"
import { Animated } from "react-native"

export const useSpringValue = (init: number, config: Partial<Animated.SpringAnimationConfig> = {}) => {
  const value = useMemo(() => new Animated.Value(init), [])
  const anim = useRef<Animated.CompositeAnimation>()
  useEffect(
    () => {
      if (anim.current) {
        anim.current.stop()
      }
      anim.current = Animated.spring(value, {
        toValue: init,
        useNativeDriver: true,
        ...config,
      })
      anim.current.start(() => {
        anim.current = null
      })
    },
    [init]
  )
  return value
}
