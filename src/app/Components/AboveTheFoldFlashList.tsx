import { Flex } from "@artsy/palette-mobile"
import { PrefetchFlashList, PrefetchFlashListProps } from "app/Components/PrefetchFlashList"

export type AboveTheFoldFlashListProps<ItemType> = {
  initialNumToRender?: number
} & PrefetchFlashListProps<ItemType>

const ESTIMATED_ITEM_SIZE = 60

export function AboveTheFoldFlashList<ItemType>(props: AboveTheFoldFlashListProps<ItemType>) {
  const { listRef, onScrollBeginDrag, ...restProps } = props
  return (
    <Flex flex={1}>
      <PrefetchFlashList<ItemType>
        {...restProps}
        listRef={listRef}
        estimatedItemSize={ESTIMATED_ITEM_SIZE}
        onScrollBeginDrag={(event) => {
          if (onScrollBeginDrag) {
            onScrollBeginDrag(event)
          }
        }}
      />
    </Flex>
  )
}
