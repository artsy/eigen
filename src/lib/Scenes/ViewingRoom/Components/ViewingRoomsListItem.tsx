import { Sans } from "@artsy/palette"
import { ViewingRoomsListItem_item } from "__generated__/ViewingRoomsListItem_item.graphql"
import React from "react"
import { View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface ViewingRoomsListItemProps {
  item: ViewingRoomsListItem_item
}

export const ViewingRoomsListItem: React.FC<ViewingRoomsListItemProps> = ({ item: { title } }) => (
  <View style={{ width: 100, height: 10, backgroundColor: "yellow" }}>
    <Sans size="3t">{title}</Sans>
  </View>
)

export const ViewingRoomsListItemFragmentContainer = createFragmentContainer(ViewingRoomsListItem, {
  item: graphql`
    fragment ViewingRoomsListItem_item on ViewingRoom {
      title
      slug
      internalID
    }
  `,
})
