import React, { useState } from "react"
import { FlatList, FlatListProps } from "react-native"

export function AboveTheFoldFlatList<ItemType>(props: { initialNumToRender: number } & FlatListProps<ItemType>) {
  const [userHasScrolled, setUserHasScrolled] = useState(false)

  return (
    <FlatList<ItemType>
      {...props}
      onScrollBeginDrag={() => setUserHasScrolled(true)}
      windowSize={userHasScrolled ? props.windowSize || 5 : 1}
    />
  )
}
