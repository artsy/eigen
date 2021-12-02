import React from "react"
import Animated from "react-native-reanimated"

interface CollapsableHeaderContext {
  scrollOffsetY: Animated.Node<number>
}

export const CollapsableHeaderContext = React.createContext<CollapsableHeaderContext>({
  scrollOffsetY: new Animated.Value(0),
})

export function useCollapsableHeaderContext() {
  return React.useContext(CollapsableHeaderContext)
}
