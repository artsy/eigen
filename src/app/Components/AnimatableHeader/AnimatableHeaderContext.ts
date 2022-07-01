import { createContext, useContext } from "react"
import Animated from "react-native-reanimated"

export interface AnimatableHeaderContextType {
  scrollOffsetY: Animated.Node<number>
  headerHeight: number
  largeTitleVerticalOffset: number
  largeTitleHeight: Animated.Value<number>
  largeTitleEndEdge: Animated.Node<number>
  title: string
  setTitle: (title: string) => void
}

export const AnimatableHeaderContext = createContext<AnimatableHeaderContextType>(null!)

export function useAnimatableHeaderContext() {
  const context = useContext(AnimatableHeaderContext)
  if (!context) {
    throw new Error(
      "useAnimatableHeaderContext must be used within a AnimatableHeaderContext.Provider"
    )
  }
  return context
}
