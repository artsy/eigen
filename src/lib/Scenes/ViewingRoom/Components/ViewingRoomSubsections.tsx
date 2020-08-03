import { Box, Flex, Text } from "@artsy/palette"
import { ViewingRoomSubsections_viewingRoom } from "__generated__/ViewingRoomSubsections_viewingRoom.graphql"
import ImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
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
            <Flex mb="1" mx="2">
              <Text variant="title">{subsection.title}</Text>
            </Flex>
          )}
          {!!subsection.body && (
            <Flex mb="2" mx="2">
              <Text variant="text">{subsection.body}</Text>
            </Flex>
          )}
          {!!subsection.image?.imageURLs?.normalized && (
            <ImageView imageURL={subsection.image.imageURLs.normalized} aspectRatio={1} />
          )}
          {!!subsection.caption && (
            <Flex mt="1" mx="2">
              <Text variant="caption" color="black60">
                {subsection.caption}
              </Text>
            </Flex>
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
          imageURLs {
            normalized
          }
        }
      }
    }
  `,
})
