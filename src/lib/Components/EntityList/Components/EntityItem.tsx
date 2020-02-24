import { Sans } from "@artsy/palette"
import React from "react"
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

export const EntityItem: React.SFC<EntityItemProps> = ({
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
    <TouchableOpacity onPress={() => onPress(href, slug, internalID)}>
      <Sans weight="medium" size="3" lineHeight="19">
        {text}
      </Sans>
    </TouchableOpacity>
  )
}
