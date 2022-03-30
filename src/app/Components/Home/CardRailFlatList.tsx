import { Spacer } from "palette"
import React from "react"
import { View } from "react-native"
import { PrefetchFlatList, PrefetchFlatListProps } from "../PrefetchFlatList"
import Spinner from "../Spinner"

export const INTER_CARD_PADDING = 15

type CardRailFlatList<ItemType> = PrefetchFlatListProps<ItemType>

export function CardRailFlatList<ItemType>({
  initialNumToRender: initialNumToRenderProp,
  ...restProps
}: CardRailFlatList<ItemType>) {
  const initialNumToRender = initialNumToRenderProp || 2

  return (
    <PrefetchFlatList<ItemType>
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
