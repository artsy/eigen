import { RefreshControl } from "react-native"
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

  const setprogressViewOffset = () => {
    if (staticHeaderHeight) {
      return useNativeValue(staticHeaderHeight, 0)
    }
  }

  return (
    <RefreshControl
      progressViewOffset={setprogressViewOffset() ?? 0}
      refreshing={refreshing}
      onRefresh={onRefresh}
      style={{ zIndex: 1 }}
    />
  )
}
