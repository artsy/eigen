/**
 * Detects if a <ScrollView /> has scrolled to the bottom.
 *
 *  @example
 *
 *  const handleScroll = ({ nativeEvent }) => {
 *    if (isCloseToBottom(nativeEvent)) {
 *      relay.loadMore(10)
 *    }
 *  }
 *
 *  return (
 *    <ScrollView onScroll={handleScroll}>
 *      <Artworks />
 *    </ScrollView>
 *  )
 */

interface Size {
  width: number
  height: number
}

interface Position {
  x: number
  y: number
}

interface Props {
  bottomPadding?: number
  contentOffset: Position
  contentSize: Size
  layoutMeasurement: Size
}

const DEFAULT_PADDING = 20

export function isCloseToBottom(props: Props) {
  const { bottomPadding = DEFAULT_PADDING, contentOffset, contentSize, layoutMeasurement } = props
  const isClose = layoutMeasurement.height + contentOffset.y >= contentSize.height - bottomPadding
  return isClose
}
