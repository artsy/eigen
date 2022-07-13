import { RefreshControl } from "react-native"
import { useStickyTabPageContext } from "./StickyTabPageContext"

export const BigHeaderRefreshControl: React.FC<{
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
