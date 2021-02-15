import { tappedCollectedArtworkImages } from "@artsy/cohesion"
import { MyCollectionArtworkHeader_artwork } from "__generated__/MyCollectionArtworkHeader_artwork.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { navigate } from "lib/navigation/navigate"
import { ScreenMargin } from "lib/Scenes/MyCollection/Components/ScreenMargin"
import { Image } from "lib/Scenes/MyCollection/State/MyCollectionArtworkModel"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { ArtworkIcon, color, Flex, Spacer, Text } from "palette"
import React from "react"
import { TouchableOpacity } from "react-native"
import { createRefetchContainer, graphql, RelayRefetchProp } from "react-relay"
import { useTracking } from "react-tracking"
import useInterval from "react-use/lib/useInterval"

interface MyCollectionArtworkHeaderProps {
  artwork: MyCollectionArtworkHeader_artwork
  relay: RelayRefetchProp
}

export const MyCollectionArtworkHeader: React.FC<MyCollectionArtworkHeaderProps> = (props) => {
  const {
    artwork: { artistNames, date, images, internalID, title, slug },
    relay,
  } = props
  const dimensions = useScreenDimensions()
  const formattedTitleAndYear = [title, date].filter(Boolean).join(", ")

  const defaultImage = images?.find((i) => i?.isDefault) || (images && images[0])

  const { trackEvent } = useTracking()

  useInterval(() => {
    if (!isImage(defaultImage) || hasImagesStillProcessing(defaultImage, images)) {
      relay.refetch(
        {
          artworkID: slug,
        },
        null,
        null,
        { force: true }
      )
    }
  }, 1000)

  const isImage = (toCheck: any): toCheck is Image => !!toCheck

  const imageIsProcessing = (image: Image | null, soughtVersion: string) => {
    if (!image) {
      return false
    }

    const isProcessing = !image.imageVersions?.includes(soughtVersion)
    return isProcessing
  }

  const hasImagesStillProcessing = (mainImage: any, imagesToCheck: MyCollectionArtworkHeader_artwork["images"]) => {
    if (!isImage(mainImage) || imageIsProcessing(mainImage, "normalized")) {
      return true
    }

    if (!imagesToCheck) {
      return false
    }

    const concreteImages = imagesToCheck as Image[]
    const stillProcessing = concreteImages.some((image) => imageIsProcessing(image, "normalized"))
    return stillProcessing
  }

  const renderMainImageView = () => {
    if (!isImage(defaultImage) || imageIsProcessing(defaultImage, "normalized")) {
      return (
        <Flex
          style={{ height: 300, alignItems: "center", justifyContent: "center", backgroundColor: color("black10") }}
        >
          <ArtworkIcon style={{ opacity: 0.6 }} height={100} width={100} />
          <Text style={{ opacity: 0.6 }}>
            {images && images?.length > 0 ? "Processing photos" : "Processing photo"}
          </Text>
        </Flex>
      )
    } else {
      return (
        <OpaqueImageView
          imageURL={defaultImage.imageURL.replace(":version", "normalized")}
          useRawURL={true}
          retryFailedURLs={true}
          height={defaultImage.height * (dimensions.width / defaultImage.width)}
          width={dimensions.width}
        />
      )
    }
  }

  return (
    <>
      <ScreenMargin>
        <Text variant="largeTitle">{artistNames}</Text>
        <Text variant="subtitle" color="black60">
          {formattedTitleAndYear}
        </Text>
      </ScreenMargin>
      <Spacer my="1" />
      <TouchableOpacity
        disabled={hasImagesStillProcessing(defaultImage, images)}
        onPress={() => {
          navigate(`/my-collection/artwork-images/${internalID}`)
          trackEvent(tracks.tappedCollectedArtworkImages(internalID, slug))
        }}
      >
        {renderMainImageView()}
        {!!images && !hasImagesStillProcessing(defaultImage, images) && (
          <Flex
            mr="2"
            style={{
              top: -50,
              alignItems: "flex-end",
            }}
          >
            <Flex
              py="0.5"
              px="2"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                borderRadius: 3,
              }}
            >
              <Text variant="small">
                {images.length} photo{images.length > 1 ? "s" : ""}
              </Text>
            </Flex>
          </Flex>
        )}
      </TouchableOpacity>
    </>
  )
}

export const MyCollectionArtworkHeaderRefetchContainer = createRefetchContainer(
  MyCollectionArtworkHeader,
  {
    artwork: graphql`
      fragment MyCollectionArtworkHeader_artwork on Artwork {
        artistNames
        date
        images {
          height
          isDefault
          imageURL
          width
          internalID
          imageVersions
        }
        internalID
        slug
        title
      }
    `,
  },
  graphql`
    query MyCollectionArtworkHeaderRefetchQuery($artworkID: String!) {
      artwork(id: $artworkID) {
        ...MyCollectionArtworkHeader_artwork
      }
    }
  `
)

const tracks = {
  tappedCollectedArtworkImages: (internalID: string, slug: string) => {
    return tappedCollectedArtworkImages({ contextOwnerId: internalID, contextOwnerSlug: slug })
  },
}
