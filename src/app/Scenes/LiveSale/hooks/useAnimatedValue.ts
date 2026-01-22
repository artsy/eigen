import { useMemo } from "react"
import { Animated } from "react-native"

export const useAnimatedValue = (initialValue: number) =>
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => new Animated.Value(initialValue), [])
