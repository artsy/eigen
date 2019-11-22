import { isFunction } from "lodash"
import { useMemo, useRef } from "react"
import { NativeScrollEvent } from "react-native"
import Animated from "react-native-reanimated"

/**
 * Detects if a <ScrollView /> has scrolled to the bottom. Taken from from RN’s ListView.js
 *
 *  @example
 *
 *  handleScroll = isCloseToBottom(() => {
 *    this.loadMore()
 *  })
 *
 *  return (
 *    <ScrollView onScroll={handleScroll}>
 *      <Artworks />
 *    </ScrollView>
 *  )
 */

const PAGE_END_THRESHOLD = 1000

type CallBack = () => void

export function isCloseToBottom(onScrollEnd: CallBack, pageEndThreshold: number = PAGE_END_THRESHOLD) {
  const state = { sentEndForContentLength: 0 }

  interface ScrollEventProps {
    nativeEvent: NativeScrollEvent
  }

  return (props: ScrollEventProps) => {
    const {
      nativeEvent: { contentOffset, contentSize, layoutMeasurement },
    } = props
    const contentLength = contentSize.height
    const isEnabled = contentLength !== state.sentEndForContentLength

    if (isEnabled) {
      const offset = contentOffset.y
      const visibleLength = layoutMeasurement.height
      const distanceFromEnd = contentLength - visibleLength - offset
      const reachedEnd = distanceFromEnd < pageEndThreshold

      if (reachedEnd) {
        state.sentEndForContentLength = contentLength

        if (isFunction(onScrollEnd)) {
          onScrollEnd()
        }
      }
    }
  }
}

/**
 * Given the appropriate reanimated values for a particular scroll view, this hook
 * calls the given callback whenever the scroll view fires a scroll event and it is
 * near to its end.
 * @param param
 */
export function useOnCloseToBottom({
  contentHeight,
  layoutHeight,
  scrollOffsetY,
  callback,
}: {
  layoutHeight: Animated.Adaptable<number>
  contentHeight: Animated.Adaptable<number>
  scrollOffsetY: Animated.Adaptable<number>
  callback: () => void
}) {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  const scrollViewisCloseToBottom = useMemo(
    () => {
      const bottomOffsetY = Animated.sub(contentHeight, layoutHeight)
      const distanceFromBottom = Animated.sub(bottomOffsetY, scrollOffsetY)
      return Animated.lessOrEq(distanceFromBottom, PAGE_END_THRESHOLD)
    },
    [layoutHeight, scrollOffsetY, contentHeight]
  )

  // scroll view values are nonsensical until the user actually scrolls so ignore first invocation which happens
  // on mount
  const isFirstInvocation = useMemo(() => new Animated.Value(1), [])

  Animated.useCode(
    () =>
      Animated.cond(
        isFirstInvocation,
        [Animated.set(isFirstInvocation, 0)],
        [
          Animated.cond(
            scrollViewisCloseToBottom,
            Animated.call([], () => {
              // TODO: debounce on native side? 🤔
              if (callbackRef.current) {
                callbackRef.current()
              }
            })
          ),
        ]
      ),
    []
  )
}
