import { Flex, Text } from "@artsy/palette-mobile"
import { TouchableOpacity } from "react-native"
import { EntityItem, EntityItemProps, Item } from "./Components/EntityItem"

interface EntityListProps {
  prefix: string
  list: ReadonlyArray<Item>
  displayedItems?: number
  count: number
  onItemSelected: EntityItemProps["onPress"]
  onViewAllPressed?: () => void
}

export const EntityList: React.FC<EntityListProps> = ({
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
    <Flex flexDirection="row" flexWrap="wrap">
      <Text variant="sm" lineHeight="19px">
        {prefix + " "}
      </Text>
      {filteredList.map((item, i) => (
        <EntityItem
          key={item.href}
          item={item}
          isFirst={i === 0}
          isLast={i === filteredList.length - 1}
          onPress={onItemSelected}
        />
      ))}
      {!!shouldShowMore && (
        <>
          <Text variant="sm" lineHeight="19px">
            {" and "}
          </Text>
          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => onViewAllPressed && onViewAllPressed()}
          >
            <Text variant="sm" weight="medium" lineHeight="19px">
              {count - displayedItems + " others"}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </Flex>
  )
}
