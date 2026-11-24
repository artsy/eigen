import { useScrollToTop } from "@react-navigation/native"
import React, { useRef } from "react"
import { FlatList, ScrollViewInstance } from "react-native"

export const useBottomTabsScrollToTop = (onScrollToTop?: () => void) => {
  const ref = useRef<ScrollViewInstance | FlatList>(null)

  useScrollToTop(
    React.useRef({
      scrollToTop: () => {
        handleScrollToTopEvent()
      },
    })
  )

  const handleScrollToTopEvent = () => {
    const flatListRef = ref as unknown as React.RefObject<FlatList> | null
    const scrollViewRef = ref as unknown as React.RefObject<ScrollViewInstance> | null

    flatListRef?.current?.scrollToOffset?.({ offset: 0 })
    scrollViewRef?.current?.scrollTo?.({})

    onScrollToTop?.()
  }

  return ref
}
