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
    const subsections = this.props.viewingRoomSubsections.subsections
    return subsections.map((subsection, index) => {
      console.log(subsection)
      return (
        <Box key={index}>
          {subsection.title && <Sans size="4">{subsection.title}</Sans>}
          {subsection.body && <Serif size="4">{subsection.body}</Serif>}
          {subsection.imageURL && <ImageView imageURL={subsection.imageURL} aspectRatio={1} />}
          {subsection.caption && (
            <Sans size="2" color="black60">
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
