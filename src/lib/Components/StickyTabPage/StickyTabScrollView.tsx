import { Spacer } from "@artsy/palette"
import React, { useContext, useEffect, useRef } from "react"
import Animated from "react-native-reanimated"
import { useAnimatedValue, useValueReader } from "./reanimatedHelpers"
import { TAB_BAR_HEIGHT } from "./StickyTabPageTabBar"

export const StickyTabScrollViewContext = React.createContext<{
  scrollOffsetY: Animated.Node<number>
  contentHeight: Animated.Node<number>
  layoutHeight: Animated.Node<number>
}>(null)

export const useStickyTabContext = () => {
  return useContext(StickyTabScrollViewContext)
}

export const StickyTabScrollView: React.FC<{
  headerHeight: number
  headerOffsetY: Animated.Value<number>
  isActive: boolean
  content: React.ReactNode
}> = ({ headerHeight, headerOffsetY, content, isActive }) => {
  const contentHeight = useAnimatedValue(0)
  const layoutHeight = useAnimatedValue(0)
  const scrollOffsetY = useAnimatedValue(0)

  const { lockHeaderPosition } = useStickyHeaderPositioning({
    headerOffsetY,
    contentHeight,
    layoutHeight,
    headerHeight,
    scrollOffsetY,
  })

  const scrollViewRef = useRef<Animated.ScrollView>()

  const readVals = useValueReader({ headerOffsetY, scrollOffsetY })

  // make sure that when the tab becomes active it does not have any unsightly padding at the top in cases
  // where the header has been retracted but this tab is near the top of its content
  useEffect(
    () => {
      if (isActive) {
        readVals().then(vals => {
          if (-vals.headerOffsetY > vals.scrollOffsetY) {
            scrollViewRef.current.getNode().scrollTo({ y: -vals.headerOffsetY, animated: false })
          }
          lockHeaderPosition.setValue(0)
        })
      } else {
        lockHeaderPosition.setValue(1)
      }
    },
    [isActive]
  )

  return (
    <StickyTabScrollViewContext.Provider value={{ contentHeight, layoutHeight, scrollOffsetY }}>
      <Animated.ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        ref={scrollViewRef}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: { y: scrollOffsetY },
                contentSize: { height: contentHeight },
                layoutMeasurement: { height: layoutHeight },
              },
            },
          ],
          {
            useNativeDriver: true,
          }
        )}
        // we want every frame to trigger an update on the native side
        scrollEventThrottle={0.0000000001}
      >
        <Spacer mb={headerHeight + TAB_BAR_HEIGHT} />
        {content}
      </Animated.ScrollView>
    </StickyTabScrollViewContext.Provider>
  )
}

function useStickyHeaderPositioning({
  headerHeight,
  scrollOffsetY,
  headerOffsetY,
  contentHeight,
  layoutHeight,
}: {
  headerHeight: number
  scrollOffsetY: Animated.Node<number>
  headerOffsetY: Animated.Value<number>
  contentHeight: Animated.Node<number>
  layoutHeight: Animated.Node<number>
}) {
  const lockHeaderPosition = useAnimatedValue(1)

  Animated.useCode(
    () => {
      // scrollDiff is the amount the header has scrolled since last time this code ran
      const scrollDiff = Animated.diff(scrollOffsetY)

      const headerIsNotFullyUp = Animated.neq(headerOffsetY, -headerHeight)

      const nearTheTop = Animated.lessOrEq(scrollOffsetY, headerHeight)

      // this is the code which actually performs the update to headerOffsetY, according to which direction
      // the scrolling is going
      const updateHeaderOffset = Animated.cond(
        Animated.greaterThan(scrollDiff, 0),
        [
          // y offset got bigger so scrolling down (content travels up the screen)
          // move the header up (hide it) unconditionally
          Animated.set(headerOffsetY, Animated.max(-headerHeight, Animated.sub(headerOffsetY, scrollDiff))),
        ],
        [
          // y offset got smaller so scrolling up (content travels down the screen)
          // if velocity is high enough or we're already moving the header up or we're near the top of the scroll view
          // then move the header down (show it)
          Animated.cond(Animated.or(headerIsNotFullyUp, nearTheTop), [
            Animated.set(headerOffsetY, Animated.min(0, Animated.sub(headerOffsetY, scrollDiff))),
          ]),
        ]
      )

      // we don't want to manipulate the header position while bouncing at the top or the bottom of the scroll view
      // cause it feels weeeird
      const notBouncingAtTheTop = Animated.greaterThan(scrollOffsetY, 0)
      const notBouncingAtTheBottom = Animated.lessThan(scrollOffsetY, Animated.sub(contentHeight, layoutHeight))

      const updateHeaderOffsetWhenNotBouncingOrLocked = Animated.cond(
        Animated.and(notBouncingAtTheTop, notBouncingAtTheBottom, Animated.not(lockHeaderPosition)),
        updateHeaderOffset,
        // deref scroll diff to prevent diff buildup when ignoring changes
        scrollDiff
      )

      // on first eval (when the component mounts) the scroll values will be nonsensical so ignore
      const firstEval = new Animated.Value(1)
      return Animated.cond(
        firstEval,
        [
          Animated.set(firstEval, 0),
          // again, deref scrollDiff to prevent buildup
          scrollDiff,
        ],
        updateHeaderOffsetWhenNotBouncingOrLocked
      )
    },
    [headerHeight]
  )

  return { lockHeaderPosition }
}
