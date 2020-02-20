import { isFunction } from "lodash"
import { NativeScrollEvent } from "react-native"

/**
 * Detects if a <Flatlist /> has scrolled to the edge of his loaded content. Taken from from RN’s ListView.js
 *
 *  @example
 *
 *  handleScroll = isCloseToEdge(() => {
 *    this.loadMore()
 *  })
 *
 *  return (
 *    <Flatlist horizontal onScroll={handleScroll}>
 *      <Artworks />
 *    </Flatlist>
 *  )
 */

const PAGE_END_THRESHOLD = 1000

type CallBack = () => void

export function isCloseToEdge(onScrollEnd: CallBack, pageEndThreshold: number = PAGE_END_THRESHOLD) {
  const state = { sentEndForContentLength: 0 }

  interface ScrollEventProps {
    nativeEvent: NativeScrollEvent
  }

  return (props: ScrollEventProps) => {
    const {
      nativeEvent: { contentOffset, contentSize, layoutMeasurement },
    } = props
    const contentLength = contentSize.width
    const isEnabled = contentLength !== state.sentEndForContentLength

    if (isEnabled) {
      const offset = contentOffset.x
      const visibleLength = layoutMeasurement.width
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
