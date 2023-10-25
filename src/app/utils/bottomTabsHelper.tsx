import EventEmitter from "events"
import { BottomTabType } from "app/Scenes/BottomTabs/BottomTabType"
import { useEffect, useRef } from "react"
import { FlatList, ScrollView } from "react-native"

export const BottomTabsEvents = new EventEmitter()
BottomTabsEvents.setMaxListeners(20)

export const SCROLL_TO_TOP_EVENT = "scrollToTop"

export const scrollTabToTop = (tab: BottomTabType) => {
  BottomTabsEvents.emit(SCROLL_TO_TOP_EVENT, { tab })
}

export const useBottomTabsScrollToTop = (tab: BottomTabType, onScrollToTop?: () => void) => {
  const ref = useRef<any>(null)

  const handleScrollToTopEvent = (...args: any[]) => {
    if (args[0]?.tab !== tab) {
      return
    }

    const flatListRef = ref as React.RefObject<FlatList> | undefined
    const scrollViewRef = ref as React.RefObject<ScrollView> | undefined

    flatListRef?.current?.scrollToOffset?.({ offset: 0 })
    scrollViewRef?.current?.scrollTo?.({})

    onScrollToTop?.()
  }

  useEffect(() => {
    BottomTabsEvents.addListener(SCROLL_TO_TOP_EVENT, handleScrollToTopEvent)

    return () => {
      BottomTabsEvents.removeListener(SCROLL_TO_TOP_EVENT, handleScrollToTopEvent)
    }
  }, [])

  return ref
}
