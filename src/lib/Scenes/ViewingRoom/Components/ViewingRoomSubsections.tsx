import { Box, Sans } from "@artsy/palette"
import { ViewingRoomSubsections_viewingRoom } from "__generated__/ViewingRoomSubsections_viewingRoom.graphql"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface ViewingRoomSubsectionProps {
  viewingRoom: ViewingRoomSubsections_viewingRoom
}

export class ViewingRoomSubsections extends React.Component<ViewingRoomSubsectionProps> {
  render() {
    return (
      <Box>
        <Sans size="4">{this.props.viewingRoom.subsections[0].title}</Sans>
      </Box>
    )
  }
}

export const ViewingRoomSubsectionsContainer = createFragmentContainer(ViewingRoomSubsections, {
  viewingRoom: graphql`
    fragment ViewingRoomSubsections_viewingRoom on ViewingRoom {
      subsections {
        body
        title
        caption
        imageURL
      }
    }
  `,
})
