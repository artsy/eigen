import { RefreshControl } from "react-native"
import Animated from "react-native-reanimated"
import { useNativeValue } from "./reanimatedHelpers"
import { useStickyTabPageContext } from "./StickyTabPageContext"

/**
 * RefreshControl for StickyTabPage. Allows for the refreshControl to be visible
 */
export const StickTabPageRefreshControl: React.FC<{
  refreshing: boolean
  onRefresh: (() => void) | undefined
}> = ({ refreshing, onRefresh }) => {
  const { staticHeaderHeight } = useStickyTabPageContext()

  const progressViewOffset = useNativeValue(staticHeaderHeight ?? new Animated.Value(0), 0)

  return (
    <RefreshControl
      progressViewOffset={progressViewOffset}
      refreshing={refreshing}
      onRefresh={onRefresh}
      style={{ zIndex: 1 }}
    />
  )
}
