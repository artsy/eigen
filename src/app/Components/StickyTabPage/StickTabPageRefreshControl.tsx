import { RefreshControl, RefreshControlProps } from "react-native"
import Animated from "react-native-reanimated"
import { useStickyTabPageContext } from "./StickyTabPageContext"
import { useNativeValue } from "./reanimatedHelpers"

/**
 * RefreshControl for StickyTabPage. Allows for the refreshControl to be visible
 */
export const StickTabPageRefreshControl: React.FC<RefreshControlProps> = ({
  refreshing,
  onRefresh,
  ...restProps
}) => {
  const { staticHeaderHeight } = useStickyTabPageContext()

  const progressViewOffset = useNativeValue(staticHeaderHeight ?? new Animated.Value(0), 0)

  return (
    <RefreshControl
      {...restProps}
      progressViewOffset={progressViewOffset}
      refreshing={refreshing}
      onRefresh={onRefresh}
      style={{ zIndex: 1 }}
    />
  )
}
