import { Spacer } from "@artsy/palette-mobile"
import {
  AboveTheFoldFlatList,
  AboveTheFoldFlatListProps,
} from "app/Components/AboveTheFoldFlatList"
import Spinner from "app/Components/Spinner"
import { View } from "react-native"

export const INTER_CARD_PADDING = 15

type CardRailFlatList<ItemType> = AboveTheFoldFlatListProps<ItemType>

export function CardRailFlatList<ItemType>({
  initialNumToRender: initialNumToRenderProp,
  ...restProps
}: CardRailFlatList<ItemType>) {
  const initialNumToRender = initialNumToRenderProp || 2

  return (
    <AboveTheFoldFlatList<ItemType>
      ListHeaderComponent={() => <Spacer x="2" />}
      ListFooterComponent={() => <Spacer x="2" />}
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
