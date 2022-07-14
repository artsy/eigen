import { RefreshControl } from "react-native"
import { useStickyTabPageContext } from "./StickyTabPageContext"

/**
 * RefreshControl for StickyTabPage when the static header is large. Allows for the refreshControl to be visible
 */
export const StickTabPageRefreshControl: React.FC<{
  refreshing: boolean
  onRefresh: (() => void) | undefined
}> = ({ refreshing, onRefresh }) => {
  const { refreshControlProgressViewOffset } = useStickyTabPageContext()

  return (
    <RefreshControl
      progressViewOffset={refreshControlProgressViewOffset ?? 0}
      refreshing={refreshing}
      onRefresh={onRefresh}
      style={{ zIndex: 1 }}
    />
  )
}
