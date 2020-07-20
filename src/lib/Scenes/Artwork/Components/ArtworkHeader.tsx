import { Box, Flex, Spacer } from "@artsy/palette"
import { ArtworkHeader_artwork } from "__generated__/ArtworkHeader_artwork.graphql"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { ArtworkActionsFragmentContainer as ArtworkActions } from "./ArtworkActions"
import { ArtworkTombstoneFragmentContainer as ArtworkTombstone } from "./ArtworkTombstone"
import { ImageCarouselFragmentContainer } from "./ImageCarousel/ImageCarousel"

interface ArtworkHeaderProps {
  artwork: ArtworkHeader_artwork
}

export const ArtworkHeader: React.FC<ArtworkHeaderProps> = props => {
  const { artwork } = props
  const screenDimensions = useScreenDimensions()

  return (
    <Box>
      <Spacer mb={2} />
      <ImageCarouselFragmentContainer
        images={artwork.images as any /* STRICTNESS_MIGRATION */}
        cardHeight={screenDimensions.width >= 375 ? 340 : 290}
      />
      <Flex alignItems="center" mt={2}>
        <ArtworkActions artwork={artwork} />
      </Flex>
      <Spacer mb={2} />
      <Box px={2}>
        <ArtworkTombstone artwork={artwork} />
      </Box>
    </Box>
  )
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
