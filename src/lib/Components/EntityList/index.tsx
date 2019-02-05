import { Flex, Sans } from "@artsy/palette"
import React from "react"
import { TouchableOpacity } from "react-native"
import { EntityItem, Item } from "./Components/EntityItem"

interface EntityListProps {
  prefix: string
  list: ReadonlyArray<Item>
  displayedItems?: number
  count: number
  onItemSelected?: (href: string) => void
  onViewAllPressed?: () => void
}

export const EntityList: React.SFC<EntityListProps> = ({
  prefix,
  list,
  displayedItems = 1,
  count,
  onItemSelected,
  onViewAllPressed,
}) => {
  if (!list.length) {
    return null
  }

  const filteredList = list.slice(0, displayedItems)
  const shouldShowMore = count > displayedItems

  return (
    <Flex flexDirection="row" flexWrap="wrap" mb="8">
      <Sans size="3" lineHeight="19">
        {prefix + " "}
      </Sans>
      {filteredList.map((item, i) => (
        <EntityItem
          key={item.href}
          item={item}
          isFirst={i === 0}
          isLast={i === filteredList.length - 1}
          onPress={onItemSelected}
        />
      ))}
      {shouldShowMore && (
        <>
          <Sans size="3" lineHeight="19">
            {" and "}
          </Sans>
          <TouchableOpacity onPress={() => onViewAllPressed && onViewAllPressed()}>
            <Sans weight="medium" size="3" lineHeight="19">
              {count - displayedItems + " others"}
            </Sans>
          </TouchableOpacity>
        </>
      )}
    </Flex>
  )
}
