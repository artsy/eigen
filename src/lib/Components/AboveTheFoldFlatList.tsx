import React, { Ref, useState } from "react"
import { FlatList, FlatListProps } from "react-native"

export function AboveTheFoldFlatList<ItemType>(
  props: { initialNumToRender: number; listRef?: Ref<FlatList<ItemType | any>> } & FlatListProps<ItemType>
) {
  const { listRef, ...restProps } = props
  const [userHasScrolled, setUserHasScrolled] = useState(false)

  return (
    <FlatList<ItemType>
      {...restProps}
      ref={listRef}
      onScrollBeginDrag={() => setUserHasScrolled(true)}
      windowSize={userHasScrolled ? props.windowSize || 5 : 1}
    />
  )
}
