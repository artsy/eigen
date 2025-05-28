import { Text } from "@artsy/palette-mobile"
import { TouchableOpacity } from "react-native"

export interface Item {
  name: string
  href: string
  slug: string
  internalID: string
}

export interface EntityItemProps {
  item: Item
  isFirst: boolean
  isLast: boolean
  onPress: (href: string, slug: string, internalID: string) => void
}

export const EntityItem: React.FC<EntityItemProps> = ({
  item: { name, href, slug, internalID },
  isFirst,
  isLast,
  onPress,
}) => {
  let text = `${name}, `

  if ((isFirst && isLast) || isLast) {
    text = name
  }

  return (
    // FIXME: Should this be a slug or internalID?
    <TouchableOpacity accessibilityRole="button" onPress={() => onPress(href, slug, internalID)}>
      <Text variant="sm" weight="medium" lineHeight="19px">
        {text}
      </Text>
    </TouchableOpacity>
  )
}
