import { ArtworkHeader_artwork } from "__generated__/ArtworkHeader_artwork.graphql"
import { Schema } from "lib/utils/track"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Box, Flex, Spacer } from "palette"
import React, { useState } from "react"
// @ts-ignore
import Share from "react-native-share"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import RNFetchBlob from "rn-fetch-blob"
import { ArtworkActionsFragmentContainer as ArtworkActions, shareContent } from "./ArtworkActions"
import { ArtworkTombstoneFragmentContainer as ArtworkTombstone } from "./ArtworkTombstone"
import { ImageCarouselFragmentContainer } from "./ImageCarousel/ImageCarousel"

interface ArtworkHeaderProps {
  artwork: ArtworkHeader_artwork
}

export const ArtworkHeader: React.FC<ArtworkHeaderProps> = (props) => {
  const { artwork } = props
  const screenDimensions = useScreenDimensions()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { trackEvent } = useTracking()

  const shareArtwork = async () => {
    trackEvent({
      action_name: Schema.ActionNames.Share,
      action_type: Schema.ActionTypes.Tap,
      context_module: Schema.ContextModules.ArtworkActions,
    })

    const { title, href, artists } = artwork
    const details = shareContent(title!, href!, artists)

    const url = ((artwork.images ?? [])[currentImageIndex]?.url ?? "").replace(":version", "large")

    const resp = await RNFetchBlob.config({
      fileCache: true,
    }).fetch("GET", url)

    const base64RawData = await resp.base64()
    const base64Data = `data:image/png;base64,${base64RawData}`

    await Share.open({
      title: details.title,
      urls: [base64Data, details.url],
      message: details.message,
    })
  }

  return (
    <Box>
      <Spacer mb={2} />
      <ImageCarouselFragmentContainer
        images={artwork.images as any /* STRICTNESS_MIGRATION */}
        cardHeight={screenDimensions.width >= 375 ? 340 : 290}
        onImageIndexChange={(imageIndex) => setCurrentImageIndex(imageIndex)}
      />
      <Flex alignItems="center" mt={2}>
        <ArtworkActions artwork={artwork} shareOnPress={() => shareArtwork()} />
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
        url: imageURL
        imageVersions
      }
      title
      href
      artists {
        name
      }
    }
  `,
})
