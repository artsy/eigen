import { Sans } from "@artsy/palette"
import React from "react"
import { TouchableOpacity } from "react-native"

export interface Item {
  name: string
  href: string
  gravityID: string
  internalID: string
}

export interface EntityItemProps {
  item: Item
  isFirst: boolean
  isLast: boolean
  onPress: (href: string, gravityID: string, internalID: string) => void
}

export const EntityItem: React.SFC<EntityItemProps> = ({
  item: { name, href, gravityID, internalID },
  isFirst,
  isLast,
  onPress,
}) => {
  let text = `${name}, `

  if ((isFirst && isLast) || isLast) {
    text = name
  }

  return (
    <TouchableOpacity onPress={() => onPress(href, gravityID, internalID)}>
      <Sans weight="medium" size="3" lineHeight="19">
        {text}
      </Sans>
    </TouchableOpacity>
  )
}
