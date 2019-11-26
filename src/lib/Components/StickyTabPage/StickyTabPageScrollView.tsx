import React from "react"
import { StickyTabFlatListProps, StickyTabPageFlatList } from "./StickyTabPageFlatList"

export const StickyTabPageScrollView: React.FC<Omit<StickyTabFlatListProps, "data">> = ({ children, ...others }) => {
  return <StickyTabPageFlatList data={[{ key: "content", content: <>{children}</> }]} {...others} />
}
