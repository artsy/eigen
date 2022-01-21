import React from "react"
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

export const AnimatableHeaderContext = React.createContext<AnimatableHeaderContextType>({
  scrollOffsetY: new Animated.Value(0),
  headerHeight: 0,
  largeTitleVerticalOffset: 0,
  title: "",
  largeTitleHeight: new Animated.Value(0),
  largeTitleEndEdge: new Animated.Value(0),
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setTitle: () => {},
})

export function useAnimatableHeaderContext() {
  return React.useContext(AnimatableHeaderContext)
}
