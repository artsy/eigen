import { GlobalState } from "lib/utils/useGlobalState"
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
}>(
  __TEST__
    ? {
        staticHeaderHeight: new Animated.Value(0),
        stickyHeaderHeight: new Animated.Value(0),
        headerOffsetY: new Animated.Value(0),
        tabLabels: ["test"],
        tabSuperscripts: ["test"],
        // tslint:disable-next-line:no-empty
        activeTabIndex: { current: 0, set() {}, useUpdates() {} },
        // tslint:disable-next-line:no-empty
        setActiveTabIndex() {},
        // tslint:disable-next-line:no-empty
        showStaticHeader() {},
        // tslint:disable-next-line:no-empty
        hideStaticHeader() {},
      }
    : (null as any)
)

export function useStickyTabPageContext() {
  return React.useContext(StickyTabPageContext)
}
