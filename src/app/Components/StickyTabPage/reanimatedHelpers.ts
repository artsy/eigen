import { useMemo, useState } from "react"
import Animated from "react-native-reanimated"

/**
 * returns a stable Animated.Value instance which starts off with the
 * given number. Note that the initialization parameter will be ignored
 * on subsequent renders
 * @param init
 * @deprecated use `useSharedValue` from `react-native-reanimated`
 */
export function useAnimatedValue(init: number) {
  return useMemo(() => {
    return new Animated.Value(init)
  }, [])
}

export function useNativeValue(node: Animated.Node<number>, init: number): number {
  const [state, setState] = useState(init)
  Animated.useCode(() => Animated.call([node], ([val]) => setState(val)), [])
  return state
}
