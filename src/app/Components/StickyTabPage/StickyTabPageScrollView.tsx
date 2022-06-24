import React from "react"
import { StickyTabFlatListProps, StickyTabPageFlatList } from "./StickyTabPageFlatList"

export const StickyTabPageScrollView: React.FC<Omit<StickyTabFlatListProps, "data">> = ({
  children,
  isRefreshing,
  refresh,
  ...others
}) => {
  return (
    <StickyTabPageFlatList
      isRefreshing={isRefreshing}
      refresh={refresh}
      data={[{ key: "content", content: <>{children}</> }]}
      {...others}
    />
  )
}
