import { Spacer } from "@artsy/palette"
import React, { Ref } from "react"
import { FlatListProps } from "react-native"
import { AboveTheFoldFlatList } from "../AboveTheFoldFlatList"
import Spinner from "../Spinner"

export function CardRailFlatList<ItemType>(props: { listRef?: Ref<ItemType | any> } & FlatListProps<ItemType>) {
  const initialNumToRender = props.initialNumToRender || 2

  return (
    <AboveTheFoldFlatList<ItemType>
      ListHeaderComponent={() => <Spacer mr={2} />}
      ListFooterComponent={() => <Spacer mr={2} />}
      ItemSeparatorComponent={() => <Spacer mr="15px" />}
      ListEmptyComponent={() => <Spinner style={{ flex: 1, marginBottom: 20 }} />}
      horizontal
      showsHorizontalScrollIndicator={false}
      scrollsToTop={false}
      initialNumToRender={initialNumToRender}
      {...props}
    />
  )
}
