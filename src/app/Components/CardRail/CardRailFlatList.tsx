import { Spacer } from "@artsy/palette-mobile"
import {
  AboveTheFoldFlatList,
  AboveTheFoldFlatListProps,
} from "app/Components/AboveTheFoldFlatList"
import Spinner from "app/Components/Spinner"
import { Ref } from "react"
import { FlatListProps, View } from "react-native"

export const INTER_CARD_PADDING = 15

type CardRailFlatList<ItemType> = AboveTheFoldFlatListProps<ItemType>

export function CardRailFlatList<ItemType>(
  props: { listRef?: Ref<ItemType | any> } & FlatListProps<ItemType>
) {
  const initialNumToRender = props.initialNumToRender || 2

  return (
    <AboveTheFoldFlatList<ItemType>
      ListHeaderComponent={() => <Spacer x={2} />}
      ListFooterComponent={() => <Spacer x={2} />}
      ItemSeparatorComponent={() => <View style={{ width: INTER_CARD_PADDING }} />}
      ListEmptyComponent={() => <Spinner style={{ flex: 1, marginBottom: 20 }} />}
      horizontal
      showsHorizontalScrollIndicator={false}
      scrollsToTop={false}
      initialNumToRender={initialNumToRender}
      {...props}
    />
  )
}
