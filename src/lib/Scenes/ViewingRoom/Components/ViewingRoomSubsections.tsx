import { ViewingRoomSubsections_viewingRoom } from "__generated__/ViewingRoomSubsections_viewingRoom.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { Box, Text } from "palette"
import { _maxWidth as maxWidth } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface ViewingRoomSubsectionProps {
  viewingRoom: ViewingRoomSubsections_viewingRoom
}

export const ViewingRoomSubsections: React.FC<ViewingRoomSubsectionProps> = props => {
  const subsections = props.viewingRoom.subsections! /* STRICTNESS_MIGRATION */
  return (
    <>
      {subsections.map((subsection, index) => (
        <Box key={index} mt="3">
          {!!subsection.title && (
            <Text mb="1" mx="2" variant="title" style={maxWidth}>
              {subsection.title}
            </Text>
          )}
          {!!subsection.body && (
            <Text mb="2" mx="2" variant="text" style={maxWidth}>
              {subsection.body}
            </Text>
          )}
          {!!subsection.image?.imageURLs?.normalized && (
            <OpaqueImageView
              imageURL={subsection.image.imageURLs.normalized}
              aspectRatio={subsection.image.width! / subsection.image.height!}
            />
          )}
          {!!subsection.caption && (
            <Text mt="1" mx="2" variant="caption" color="black60">
              {subsection.caption}
            </Text>
          )}
        </Box>
      ))}
    </>
  )
}

export const ViewingRoomSubsectionsContainer = createFragmentContainer(ViewingRoomSubsections, {
  viewingRoom: graphql`
    fragment ViewingRoomSubsections_viewingRoom on ViewingRoom {
      subsections {
        body
        title
        caption
        image {
          width
          height
          imageURLs {
            normalized
          }
        }
      }
    }
  `,
})
