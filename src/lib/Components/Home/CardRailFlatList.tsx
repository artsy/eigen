import { Spacer } from "@artsy/palette"
import React from "react"
import { FlatListProps } from "react-native"
import { AboveTheFoldFlatList } from "../AboveTheFoldFlatList"
import Spinner from "../Spinner"

export function CardRailFlatList<ItemType>(props: FlatListProps<ItemType>) {
  return (
    <AboveTheFoldFlatList<ItemType>
      ListHeaderComponent={() => <Spacer mr={2} />}
      ListFooterComponent={() => <Spacer mr={2} />}
      ItemSeparatorComponent={() => <Spacer mr="15px" />}
      ListEmptyComponent={() => <Spinner style={{ flex: 1, marginBottom: 20 }} />}
      horizontal
      showsHorizontalScrollIndicator={false}
      scrollsToTop={false}
      initialNumToRender={2}
      {...props}
    />
  )
}
