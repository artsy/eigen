import { Flex, Sans } from "@artsy/palette"
import React from "react"
import { TouchableOpacity } from "react-native"

interface Item {
  name: string
  href: string
}

interface EntityListProps {
  prefix: string
  list: Item[]
  displayedItems?: number
  count: number
}

interface EntityItemProps {
  item: Item
  isFirst: boolean
  isLast: boolean
}

export const EntityItem: React.SFC<EntityItemProps> = ({ item: { name, href }, isFirst, isLast }) => {
  let text = `${name}, `

  if ((isFirst && isLast) || isLast) {
    text = name
  }

  return (
    <TouchableOpacity onPress={() => this.handlePress(this, href)}>
      <Sans weight="medium" size="3" lineHeight="19">
        {text}
      </Sans>
    </TouchableOpacity>
  )
}

export const EntityList: React.SFC<EntityListProps> = ({ prefix, list, displayedItems = 1, count }) => {
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
        <EntityItem item={item} isFirst={i === 0} isLast={i === filteredList.length - 1} />
      ))}
      {shouldShowMore && (
        <>
          <Sans size="3" lineHeight="19">
            {" and "}
          </Sans>
          <TouchableOpacity onPress={() => this.props.viewAllArtists()}>
            <Sans weight="medium" size="3" lineHeight="19">
              {count - displayedItems + " others"}
            </Sans>
          </TouchableOpacity>
        </>
      )}
    </Flex>
  )
}
