import { ItemInfo_item$data } from "__generated__/ItemInfo_item.graphql"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { ItemArtworkFragmentContainer } from "./ItemArtwork"
import { ItemShowFragmentContainer } from "./ItemShow"

interface ItemInfoProps {
  item: ItemInfo_item$data
}

export const ItemInfo: React.FC<ItemInfoProps> = ({ item }) => {
  switch (item.__typename) {
    case "Artwork":
      return <ItemArtworkFragmentContainer artwork={item} />
    case "Show":
      return <ItemShowFragmentContainer show={item} />
    default:
      throw new Error("ConversationDetails ItemInfo: type not supported")
  }
}

export const ItemInfoFragmentContainer = createFragmentContainer(ItemInfo, {
  item: graphql`
    fragment ItemInfo_item on ConversationItemType {
      ...ItemArtwork_artwork
      ...ItemShow_show
      __typename
    }
  `,
})
