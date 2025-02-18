import { Flex } from "@artsy/palette-mobile"
import { FlashList, FlashListProps } from "@shopify/flash-list"
import { Ref } from "react"

export type InfiniteScrollFlashListProps<ItemType> = {
  listRef?: Ref<ItemType | any>
  initialNumToRender?: number
} & FlashListProps<ItemType>

const ESTIMATED_ITEM_SIZE = 60

export function InfiniteScrollFlashList<ItemType>(props: InfiniteScrollFlashListProps<ItemType>) {
  const { listRef, onScrollBeginDrag, ...restProps } = props

  return (
    <Flex flex={1}>
      <FlashList<ItemType>
        {...restProps}
        ref={listRef}
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
