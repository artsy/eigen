import { Box, Sans, Serif } from "@artsy/palette"
import { ViewingRoomSubsections_viewingRoomSubsections } from "__generated__/ViewingRoomSubsections_viewingRoomSubsections.graphql"
import ImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface ViewingRoomSubsectionProps {
  viewingRoomSubsections: ViewingRoomSubsections_viewingRoomSubsections
}

export class ViewingRoomSubsections extends React.Component<ViewingRoomSubsectionProps> {
  render() {
    const subsections = this.props.viewingRoomSubsections.subsections! /* STRICTNESS_MIGRATION */
    return subsections.map((subsection, index) => {
      return (
        <Box key={index} mt="3">
          {subsection.title && (
            <Sans size="4" mb="1" mx="2">
              {subsection.title}
            </Sans>
          )}
          {subsection.body && (
            <Serif size="4" mb="2" mx="2">
              {subsection.body}
            </Serif>
          )}
          {subsection.imageURL && <ImageView imageURL={subsection.imageURL} aspectRatio={1} />}
          {subsection.caption && (
            <Sans size="2" color="black60" mt="1" mx="2">
              {subsection.caption}
            </Sans>
          )}
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
