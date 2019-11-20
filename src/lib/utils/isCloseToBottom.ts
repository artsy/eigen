import { isFunction } from "lodash"
import { NativeScrollEvent } from "react-native"

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

export const PAGE_END_THRESHOLD = 1000

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
