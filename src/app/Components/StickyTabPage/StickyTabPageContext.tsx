import { GlobalState } from "app/utils/useGlobalState"
import React from "react"
import Animated from "react-native-reanimated"

export const StickyTabPageContext = React.createContext<{
  staticHeaderHeight: Animated.Node<number> | null
  stickyHeaderHeight: Animated.Node<number> | null
  headerOffsetY: Animated.Value<number>
  tabLabels: string[]
  tabSuperscripts: Array<string | undefined>
  activeTabIndex: GlobalState<number>
  showStaticHeader: () => void
  hideStaticHeader: () => void
  setActiveTabIndex(index: number): void
}>(null as any)

export function useStickyTabPageContext() {
  return React.useContext(StickyTabPageContext)
}
