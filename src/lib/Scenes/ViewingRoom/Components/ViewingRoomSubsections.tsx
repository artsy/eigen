import { Box, Sans } from "@artsy/palette"
import { ViewingRoomSubsections_viewingRoomSubsections } from "__generated__/ViewingRoomSubsections_viewingRoomSubsections.graphql"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface ViewingRoomSubsectionProps {
  viewingRoomSubsections: ViewingRoomSubsections_viewingRoomSubsections
}

export class ViewingRoomSubsections extends React.Component<ViewingRoomSubsectionProps> {
  render() {
    const subsections = this.props.viewingRoomSubsections.subsections
    subsections.map(subsection => console.log(subsection))
    return subsections.map(subsection => {
      return (
        <Box>
          <Sans size="4">{subsection.title}</Sans>
        </Box>
      )
    })
  }
}

export const ViewingRoomSubsectionsContainer = createFragmentContainer(ViewingRoomSubsections, {
  viewingRoomSubsections: graphql`
    fragment ViewingRoomSubsections_viewingRoomSubsections on ViewingRoom {
      subsections {
        body
        title
        caption
        imageURL
      }
    }
  `,
})
