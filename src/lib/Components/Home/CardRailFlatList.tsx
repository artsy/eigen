import { Spacer } from "palette"
import React from "react"
import { View } from "react-native"
import { AboveTheFoldFlatList, AboveTheFoldFlatListProps } from "../AboveTheFoldFlatList"
import Spinner from "../Spinner"

export const INTER_CARD_PADDING = 15

type CardRailFlatList<ItemType> = AboveTheFoldFlatListProps<ItemType>

export function CardRailFlatList<ItemType>({
  initialNumToRender: initialNumToRenderProp,
  ...restProps
}: CardRailFlatList<ItemType>) {
  const initialNumToRender = initialNumToRenderProp || 2

  return (
    <AboveTheFoldFlatList<ItemType>
      ListHeaderComponent={() => <Spacer mr={2} />}
      ListFooterComponent={() => <Spacer mr={2} />}
      ItemSeparatorComponent={() => <View style={{ width: INTER_CARD_PADDING }} />}
      ListEmptyComponent={() => <Spinner style={{ flex: 1, marginBottom: 20 }} />}
      horizontal
      showsHorizontalScrollIndicator={false}
      scrollsToTop={false}
      initialNumToRender={initialNumToRender}
      {...restProps}
    />
  )
}
