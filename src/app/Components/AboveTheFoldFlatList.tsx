import React, { useState } from "react"
import { PrefetchFlatList, PrefetchFlatListProps } from "./PrefetchFlatList"

export type AboveTheFoldFlatListProps<ItemType> = {
  initialNumToRender?: number
} & PrefetchFlatListProps<ItemType>

export function AboveTheFoldFlatList<ItemType>(props: AboveTheFoldFlatListProps<ItemType>) {
  const { listRef, onScrollBeginDrag, ...restProps } = props
  const [userHasScrolled, setUserHasScrolled] = useState(false)

  return (
    <PrefetchFlatList<ItemType>
      {...restProps}
      listRef={listRef}
      onScrollBeginDrag={(event) => {
        if (onScrollBeginDrag) {
          onScrollBeginDrag(event)
        }
        setUserHasScrolled(true)
      }}
      windowSize={userHasScrolled ? props.windowSize || 5 : 1}
    />
  )
}
