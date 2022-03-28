import React, { createContext, useRef, useState } from "react"
import { Animated } from "react-native"
import { FlatList as RNGHFlatList, PanGestureHandler } from "react-native-gesture-handler"

type ListRef = React.MutableRefObject<{ getNode(): RNGHFlatList<any> } | null>

interface GestureContainerContextType {
  /**
   * Register the flatlist that contains the content. You need to pass the
   *  index (from L to R starting from zero). This is so the container can
   *  know which Ref to perform scroll on
   */
  registerListRef: (index: number, listRef: ListRef) => void

  /** Call this when you switch tabs so the container knows which content is in view
   *  This is how it knows which Flatlist to trigger scroll on
   */
  setCurrentContentIndex: (index: number) => void

  /** Provides the header height of the StickyHeader to the container.
   * This is used to know by how much scroll offset to apply
   */
  setHeaderHeight: (index: number) => void
}

export const StickyTabPageGestureContainerContext = createContext<GestureContainerContextType>({
  registerListRef: () => null,
  setCurrentContentIndex: () => null,
  setHeaderHeight: () => null,
})

export const StickyTabPageGestureContainer: React.FC<{}> = ({ children }) => {
  const [currentContentIndex, setCurrentContentIndex] = useState(0)
  const [headerHeight, setHeaderHeight] = useState(0)

  const registeredListRefs = useRef<Record<number, ListRef>>({})

  const _registerAListRefByIndex = (index: number, listRef: ListRef) => {
    registeredListRefs.current[index] = listRef
  }

  const prevValue = useRef(0)

  return (
    <StickyTabPageGestureContainerContext.Provider
      value={{
        registerListRef: (i, r) => _registerAListRefByIndex(i, r),
        setCurrentContentIndex,
        setHeaderHeight,
      }}
    >
      <PanGestureHandler
        onGestureEvent={({ nativeEvent: { translationY } }) => {
          if (!!registeredListRefs.current) {
            const params = {
              offset: 0 > translationY ? headerHeight : -headerHeight,
              animated: true,
            }
            registeredListRefs.current[currentContentIndex]?.current
              ?.getNode()
              .scrollToOffset(params)
            prevValue.current = params.offset
          }
        }}
      >
        <Animated.View style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          {children}
        </Animated.View>
      </PanGestureHandler>
    </StickyTabPageGestureContainerContext.Provider>
  )
}
