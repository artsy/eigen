import { ViewingRoomSubsections_viewingRoom$data } from "__generated__/ViewingRoomSubsections_viewingRoom.graphql"
import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { Box, Text } from "palette"
import { _maxWidth as maxWidth } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface ViewingRoomSubsectionProps {
  viewingRoom: ViewingRoomSubsections_viewingRoom$data
}

export const ViewingRoomSubsections: React.FC<ViewingRoomSubsectionProps> = (props) => {
  const subsections = props.viewingRoom.subsections! /* STRICTNESS_MIGRATION */
  return (
    <>
      {subsections.map((subsection, index) => (
        <Box key={index} mt="3">
          {!!subsection.title && (
            <Box mx="2" testID="subsection">
              <Text mb="1" variant="md" style={maxWidth}>
                {subsection.title}
              </Text>
            </Box>
          )}
          {!!subsection.body && (
            <Box mx="2">
              <Text mb="2" variant="sm" style={maxWidth}>
                {subsection.body}
              </Text>
            </Box>
          )}
          {!!subsection.image?.imageURLs?.normalized && (
            <OpaqueImageView
              imageURL={subsection.image.imageURLs.normalized}
              aspectRatio={subsection.image.width! / subsection.image.height!}
            />
          )}
          {!!subsection.caption && (
            <Box mx="2">
              <Text mt="1" variant="xs" color="black60">
                {subsection.caption}
              </Text>
            </Box>
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
