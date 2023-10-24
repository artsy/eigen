import EventEmitter from "events"
import { BottomTabType } from "app/Scenes/BottomTabs/BottomTabType"
import { useEffect } from "react"
import { FlatList, ScrollView } from "react-native"

export const BottomTabsEvents = new EventEmitter()
BottomTabsEvents.setMaxListeners(20)

export const SCROLL_TO_TOP_EVENT = "scrollToTop"

export const scrollTabToTop = (tab: BottomTabType) => {
  BottomTabsEvents.emit(SCROLL_TO_TOP_EVENT, { tab })
}

export const useBottomTabsScrollToTop = (
  tab: BottomTabType,
  ref: React.RefObject<FlatList | ScrollView>
) => {
  const handleScrollToTopEvent = (...args: any[]) => {
    if (args[0]?.tab !== tab) {
      return
    }

    // To support both FlatList and ScrollView
    ;(ref as React.RefObject<FlatList>)?.current?.scrollToIndex?.({ index: 0 })
    ;(ref as React.RefObject<ScrollView>)?.current?.scrollTo?.({})
  }

  useEffect(() => {
    BottomTabsEvents.addListener(SCROLL_TO_TOP_EVENT, handleScrollToTopEvent)

    return () => {
      BottomTabsEvents.removeListener(SCROLL_TO_TOP_EVENT, handleScrollToTopEvent)
    }
  }, [])
}
