import { useMemo } from "react"
import Animated from "react-native-reanimated"

/**
 * Returns a stable Animated.Value. Does not update the value after mounting.
 * @param initialValue the initial value
 */
export const useReanimatedValue = (initialValue: number) => useMemo(() => new Animated.Value(initialValue), [])
