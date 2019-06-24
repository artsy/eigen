import { Box, Flex, Spacer } from "@artsy/palette"
import { ArtworkHeader_artwork } from "__generated__/ArtworkHeader_artwork.graphql"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { ArtworkActionsFragmentContainer as ArtworkActions } from "./ArtworkActions"
import { ArtworkTombstoneFragmentContainer as ArtworkTombstone } from "./ArtworkTombstone"
import { ImageCarouselFragmentContainer as ImageCarousel } from "./ImageCarousel/ImageCarousel"

interface ArtworkHeaderProps {
  artwork: ArtworkHeader_artwork
}

export class ArtworkHeader extends React.Component<ArtworkHeaderProps> {
  render() {
    const { artwork } = this.props
    return (
      <Box>
        <ImageCarousel images={artwork.images} />
        <Flex alignItems="center" mt={2}>
          <ArtworkActions artwork={artwork} />
        </Flex>
        <Spacer mb={2} />
        <ArtworkTombstone artwork={artwork} />
      </Box>
    )
  }
}

export const ArtworkHeaderFragmentContainer = createFragmentContainer(ArtworkHeader, {
  artwork: graphql`
    fragment ArtworkHeader_artwork on Artwork {
      ...ArtworkActions_artwork
      ...ArtworkTombstone_artwork
      images {
        ...ImageCarousel_images
      }
    }
  `,
})
