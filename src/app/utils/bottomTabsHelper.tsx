import EventEmitter from "events"
import { useScrollToTop } from "@react-navigation/native"
import { BottomTabType } from "app/Scenes/BottomTabs/BottomTabType"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import React, { useEffect, useRef } from "react"
import { FlatList, ScrollView } from "react-native"

export const BottomTabsEvents = new EventEmitter()
BottomTabsEvents.setMaxListeners(20)

export const SCROLL_TO_TOP_EVENT = "scrollToTop"

export const scrollTabToTop = (tab: BottomTabType) => {
  BottomTabsEvents.emit(`${SCROLL_TO_TOP_EVENT}-${tab}`)
}

export const useBottomTabsScrollToTop = (tab: BottomTabType, onScrollToTop?: () => void) => {
  const enableNewNavigation = useFeatureFlag("AREnableNewNavigation")

  const ref = useRef<ScrollView | FlatList>(null)

  useScrollToTop(
    React.useRef({
      scrollToTop: () => {
        handleScrollToTopEvent()
      },
    })
  )

  const handleScrollToTopEvent = () => {
    const flatListRef = ref as unknown as React.RefObject<FlatList> | null
    const scrollViewRef = ref as unknown as React.RefObject<ScrollView> | null

    flatListRef?.current?.scrollToOffset?.({ offset: 0 })
    scrollViewRef?.current?.scrollTo?.({})

    onScrollToTop?.()
  }

  useEffect(() => {
    if (enableNewNavigation) {
      return
    }

    BottomTabsEvents.addListener(`${SCROLL_TO_TOP_EVENT}-${tab}`, handleScrollToTopEvent)

    return () => {
      BottomTabsEvents.removeListener(`${SCROLL_TO_TOP_EVENT}-${tab}`, handleScrollToTopEvent)
    }
  }, [])

  return ref
}
