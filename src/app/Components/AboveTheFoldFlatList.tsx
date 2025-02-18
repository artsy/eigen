import { Ref, useState } from "react"
import { FlatList, FlatListProps } from "react-native"

export type AboveTheFoldFlatListProps<ItemType> = {
  initialNumToRender?: number
} & FlatListProps<ItemType>

export function AboveTheFoldFlatList<ItemType>(
  props: {
    initialNumToRender: number
    listRef?: Ref<FlatList<ItemType | any>>
  } & FlatListProps<ItemType>
) {
  const { listRef, onScrollBeginDrag, ...restProps } = props
  const [userHasScrolled, setUserHasScrolled] = useState(false)

  return (
    <FlatList<ItemType>
      {...restProps}
      ref={listRef}
      onScrollBeginDrag={(event) => {
        if (onScrollBeginDrag) {
          onScrollBeginDrag(event)
        }
        setUserHasScrolled(true)
      }}
      windowSize={userHasScrolled ? props.windowSize || 5 : 2}
    />
  )
}
