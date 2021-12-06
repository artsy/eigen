import React from "react"
import Animated from "react-native-reanimated"

export interface CollapsibleHeaderContextType {
  scrollOffsetY: Animated.Node<number>
  stickyHeaderContent: React.ReactNode
  stickyHeaderContentHeight: Animated.Node<number>
  totalHeaderHeight: Animated.Node<number>
  headerHeight: number
  setJSX: (jsx: React.ReactNode) => void
}

export const CollapsibleHeaderContext = React.createContext<CollapsibleHeaderContextType>({
  scrollOffsetY: new Animated.Value(0),
  stickyHeaderContent: null,
  stickyHeaderContentHeight: new Animated.Value(0),
  totalHeaderHeight: new Animated.Value(0),
  headerHeight: 0,
  // tslint:disable-next-line:no-empty
  setJSX: () => {},
})

export function useCollapsibleHeaderContext() {
  return React.useContext(CollapsibleHeaderContext)
}
