import React from "react"
import Animated from "react-native-reanimated"

export interface CollapsableHeaderContextType {
  scrollOffsetY: Animated.Node<number>
  stickyHeaderContent: JSX.Element
  stickyHeaderContentHeight: Animated.Node<number>
  setJSX: (jsx: JSX.Element) => void
}

export const CollapsableHeaderContext = React.createContext<CollapsableHeaderContextType>({
  scrollOffsetY: new Animated.Value(0),
  stickyHeaderContent: null,
  stickyHeaderContentHeight: new Animated.Value(0),
  // tslint:disable-next-line:no-empty
  setJSX: () => {},
})

export function useCollapsableHeaderContext() {
  return React.useContext(CollapsableHeaderContext)
}
