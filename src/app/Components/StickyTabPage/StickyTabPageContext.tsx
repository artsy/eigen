import { GlobalState } from "app/utils/useGlobalState"
import React from "react"
import { FlatList } from "react-native"
import Animated from "react-native-reanimated"
import { TabVisualClues } from "./StickyTabPage"

export const StickyTabPageContext = React.createContext<{
  staticHeaderHeight: Animated.Node<number> | null
  stickyHeaderHeight: Animated.Node<number> | null
  headerOffsetY: Animated.Value<number>
  tabLabels: string[]
  tabVisualClues: Array<TabVisualClues | undefined>
  activeTabIndex: GlobalState<number>
  setActiveTabIndex(index: number): void
  adjustCurrentOffset(): void

  /** DO NOT USE. FOR INTERNAL PURPOSE ONLY!!!!
   *
   * Used internally to allow each of the Flatlists that wraps the Content of a tab passed to StickyTabPage to add itself
   * to a record. When the tab is Active we can find this stored ref by the index of the Flatlist in the rail
   *  and perform scroll on it.
   *
   */
  __INTERNAL__registerFlatListRef(ref: typeof FlatList, index: number): void
}>(null as any)

export function useStickyTabPageContext() {
  return React.useContext(StickyTabPageContext)
}
