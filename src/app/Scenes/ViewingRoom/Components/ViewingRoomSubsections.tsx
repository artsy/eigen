import { Box, Image, Text, useScreenDimensions } from "@artsy/palette-mobile"
import { ViewingRoomSubsections_viewingRoom$data } from "__generated__/ViewingRoomSubsections_viewingRoom.graphql"
import { createFragmentContainer, graphql } from "react-relay"

interface ViewingRoomSubsectionProps {
  viewingRoom: ViewingRoomSubsections_viewingRoom$data
}

export const ViewingRoomSubsections: React.FC<ViewingRoomSubsectionProps> = (props) => {
  const subsections = props.viewingRoom.subsections
  const { width: screenWidth } = useScreenDimensions()

  const calculateImageHeight = (imageWidth: number, imageHeight: number, screenWidth: number) => {
    return (imageHeight / imageWidth) * screenWidth
  }

  return (
    <>
      {subsections.map((subsection, index) => {
        const shouldDisplayImage =
          !!subsection.image?.imageURLs?.normalized &&
          !!subsection?.image?.width &&
          !!subsection?.image?.height

        return (
          <Box key={index} mt={4}>
            {!!subsection.title && (
              <Box mx={2} testID="subsection">
                <Text mb={1} variant="sm-display" maxWidth>
                  {subsection.title}
                </Text>
              </Box>
            )}
            {!!subsection.body && (
              <Box mx={2}>
                <Text mb={2} variant="sm" maxWidth>
                  {subsection.body}
                </Text>
              </Box>
            )}
            {!!shouldDisplayImage && (
              <Image
                src={subsection.image.imageURLs.normalized}
                width={screenWidth}
                height={calculateImageHeight(
                  subsection.image.width,
                  subsection.image.height,
                  screenWidth
                )}
              />
            )}
            {!!subsection.caption && (
              <Box mx={2}>
                <Text mt={1} variant="xs" color="mono60">
                  {subsection.caption}
                </Text>
              </Box>
            )}
          </Box>
        )
      })}
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
