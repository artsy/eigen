import { useAnimatedValue } from "lib/utils/useAnimatedValue"
import { useEffect, useRef } from "react"
import { Animated } from "react-native"
import { NewImagesCarouselStore } from "./NewImagesCarouselContext"

/**
 * Hooks into the lifecycle of the full screen carousel to fade components in/out
 * once the full screen carousel is able to display its content.
 * @param fade either "in" or "out"
 */
export const useSpringFade = (fade: "in" | "out") => {
  const fullScreenState = NewImagesCarouselStore.useStoreState((state) => state.fullScreenState)

  const isFullScreenReady = fullScreenState === "entering" || fullScreenState === "entered"
  const [from, to] = fade === "in" ? [0, 1] : [1, 0]
  return useSpringValue(isFullScreenReady ? to : from)
}

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
export const useSpringValue = (currentValue: number, config: Partial<Animated.SpringAnimationConfig> = {}) => {
  const value = useAnimatedValue(currentValue)
  const anim = useRef<Animated.CompositeAnimation>()
  useEffect(() => {
    if (anim.current) {
      anim.current.stop()
    }
    anim.current = Animated.spring(value, {
      toValue: currentValue,
      useNativeDriver: true,
      speed: 1,
      ...config,
    })
    anim.current.start(() => {
      anim.current = undefined
    })
  }, [currentValue])
  return value
}
