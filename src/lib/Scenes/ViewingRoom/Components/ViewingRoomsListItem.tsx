import { Sans } from "@artsy/palette"
import { ViewingRoomsListItem_data } from "__generated__/ViewingRoomsListItem_data.graphql"
import React from "react"
import { View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface ViewingRoomsListItemProps {
  data: ViewingRoomsListItem_data
}

export const ViewingRoomsListItem: React.FC<ViewingRoomsListItemProps> = ({ data: { title } }) => (
  <View style={{ width: 100, height: 10, backgroundColor: "yellow" }}>
    <Sans size="3t">{title}</Sans>
  </View>
)

export const ViewingRoomsListItemFragmentContainer = createFragmentContainer(ViewingRoomsListItem, {
  data: graphql`
    fragment ViewingRoomsListItem_data on ViewingRoom {
      title
      slug
      internalID
    }
  `,
})
