import React, { useContext, useRef } from "react"
import Animated from "react-native-reanimated"
import { useAnimatedValue } from "./reanimatedHelpers"
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
  headerHeight: Animated.Node<number>
  headerOffsetY: Animated.Value<number>
  tabIndex: number
  activeTabIndex: Animated.Node<number>
  content: React.ReactNode
}> = ({ headerHeight, headerOffsetY, content, tabIndex, activeTabIndex }) => {
  const contentHeight = useAnimatedValue(0)
  const layoutHeight = useAnimatedValue(0)
  const scrollOffsetY = useAnimatedValue(0)

  const isActive = Animated.eq(tabIndex, activeTabIndex)

  const { lockHeaderPosition } = useStickyHeaderPositioning({
    headerOffsetY,
    contentHeight,
    layoutHeight,
    headerHeight,
    scrollOffsetY,
  })

  const scrollViewRef = useRef<Animated.ScrollView>()

  const lastIsActive = useAnimatedValue(-1)

  // prevent this tab from manipulating the header position when it is not active
  Animated.useCode(
    () =>
      // when the active state changes
      Animated.cond(Animated.neq(lastIsActive, isActive), [
        Animated.set(lastIsActive, isActive),
        Animated.cond(
          isActive,
          [
            // the tab just became active so we might need to adjust the scroll offset to avoid unwanted
            // white space before allowing the scroll offset to affect the header position
            Animated.cond(
              Animated.greaterThan(Animated.multiply(-1, headerOffsetY), scrollOffsetY),
              Animated.call([headerOffsetY], ([y]) => {
                if (!scrollViewRef.current) {
                  throw new Error(
                    "Please make sure that tab content is wrapped with a StickyTabPageFlatList or a StickyTabPageScrollView"
                  )
                }
                scrollViewRef.current.getNode().scrollTo({ y: -y, animated: false })
                lockHeaderPosition.setValue(0)
              }),
              Animated.set(lockHeaderPosition, 0)
            ),
          ],
          Animated.set(lockHeaderPosition, 1)
        ),
      ]),
    []
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
        <Animated.View style={{ flex: 1, height: Animated.add(headerHeight, TAB_BAR_HEIGHT) }} />
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
  headerHeight: Animated.Node<number>
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

      const headerIsNotFullyUp = Animated.neq(headerOffsetY, negative(headerHeight))

      const nearTheTop = Animated.lessOrEq(scrollOffsetY, headerHeight)

      // this is the code which actually performs the update to headerOffsetY, according to which direction
      // the scrolling is going
      const updateHeaderOffset = Animated.cond(
        Animated.greaterThan(scrollDiff, 0),
        [
          // y offset got bigger so scrolling down (content travels up the screen)
          // move the header up (hide it) unconditionally
          Animated.set(headerOffsetY, Animated.max(negative(headerHeight), Animated.sub(headerOffsetY, scrollDiff))),
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

const negative = (node: Animated.Node<number>) => Animated.multiply(-1, node)
