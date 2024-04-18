import { Spacer, Flex, Box } from "@artsy/palette-mobile"
import { ArtworkHeader_artwork$data } from "__generated__/ArtworkHeader_artwork.graphql"
import { useShareSheet } from "app/Components/ShareSheet/ShareSheetContext"
import {
  ExpiredOfferMessage,
  UnavailableOfferMessage,
} from "app/Scenes/Artwork/Components/ArtworkMessages"
import { useScreenDimensions } from "app/utils/hooks"
import { useDevToggle } from "app/utils/hooks/useDevToggle"
import { Schema } from "app/utils/track"
import { guardFactory } from "app/utils/types/guardFactory"
import { isEmpty } from "lodash"
import { useState } from "react"
import { Button, Modal } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import { ArtworkActionsFragmentContainer as ArtworkActions } from "./ArtworkActions"
import { ArtworkTombstoneFragmentContainer as ArtworkTombstone } from "./ArtworkTombstone"
import { ImageCarouselFragmentContainer } from "./ImageCarousel/ImageCarousel"
import { InstagramStoryViewShot } from "./InstagramStoryViewShot"

interface ArtworkHeaderProps {
  artwork: ArtworkHeader_artwork$data
  refetchArtwork: () => void
  artworkOfferUnavailable?: boolean
  artworkOfferExpired?: boolean
}

export enum VisibilityLevels {
  DRAFT = "DRAFT",
  LISTED = "LISTED",
  UNLISTED = "UNLISTED",
}

export const ArtworkHeader: React.FC<ArtworkHeaderProps> = (props) => {
  const { trackEvent } = useTracking()
  const { showShareSheet } = useShareSheet()
  const { artwork, refetchArtwork, artworkOfferExpired, artworkOfferUnavailable } = props
  const screenDimensions = useScreenDimensions()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const debugInstagramShot = useDevToggle("DTShowInstagramShot")
  const [showInstagramShot, setShowInstagramShot] = useState(false)

  const imageFigures = artwork.images.filter(guardFactory("__typename", "Image"))
  const currentImage = (imageFigures ?? [])[currentImageIndex]
  const currentImageUrl = (currentImage?.imageURL ?? "").replace(":version", "large")

  if (isEmpty(artwork)) {
    return null
  }

  return (
    <>
      <Box>
        {!!artworkOfferUnavailable && (
          <Flex mb={1}>
            <UnavailableOfferMessage />
          </Flex>
        )}
        {!!artworkOfferExpired && (
          <Flex mb={1}>
            <ExpiredOfferMessage />
          </Flex>
        )}
        <Spacer y={2} />
        <ImageCarouselFragmentContainer
          figures={artwork.figures}
          setVideoAsCover={artwork.isSetVideoAsCover ?? false}
          cardHeight={screenDimensions.width >= 375 ? 340 : 290}
          onImageIndexChange={(imageIndex) => setCurrentImageIndex(imageIndex)}
        />

        {debugInstagramShot ? (
          <Button title="debug instagram shot" onPress={() => setShowInstagramShot(true)} />
        ) : null}

        <Flex alignItems="center" mt={2}>
          <ArtworkActions
            artwork={artwork}
            shareOnPress={() => {
              trackEvent({
                action_name: Schema.ActionNames.Share,
                action_type: Schema.ActionTypes.Tap,
                context_module: Schema.ContextModules.ArtworkActions,
              })
              showShareSheet({
                type: "artwork",
                slug: artwork.slug,
                artists: artwork.artists,
                internalID: artwork.internalID,
                currentImageIndex,
                title: artwork.title || "",
                href: artwork.href || "",
                images: imageFigures,
              })
            }}
          />
        </Flex>
        <Spacer y={4} />
        <Box px={2}>
          <ArtworkTombstone artwork={artwork} refetchArtwork={refetchArtwork} />
        </Box>
      </Box>

      {debugInstagramShot && showInstagramShot && currentImageUrl ? (
        <Modal visible={showInstagramShot} onRequestClose={() => setShowInstagramShot(false)}>
          <InstagramStoryViewShot
            href={currentImageUrl}
            artist={artwork.artists?.[0]?.name || ""}
            title={artwork.title || ""}
          />
          <Flex position="absolute" top={100} left={0}>
            <Button title="close instagram shot" onPress={() => setShowInstagramShot(false)} />
          </Flex>
        </Modal>
      ) : null}
    </>
  )
}

export const ArtworkHeaderFragmentContainer = createFragmentContainer(ArtworkHeader, {
  artwork: graphql`
    fragment ArtworkHeader_artwork on Artwork {
      ...ArtworkActions_artwork
      ...ArtworkTombstone_artwork

      figures {
        ...ImageCarousel_figures
      }

      images: figures {
        __typename
        ... on Image {
          imageURL
        }
      }

      isSetVideoAsCover
      title
      href
      internalID
      slug
      visibilityLevel
      artists {
        name
      }
      partner {
        name
      }
    }
  `,
})
