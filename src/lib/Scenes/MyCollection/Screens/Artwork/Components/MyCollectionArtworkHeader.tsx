import { tappedCollectedArtworkImages } from "@artsy/cohesion"
import { MyCollectionArtworkHeader_artwork } from "__generated__/MyCollectionArtworkHeader_artwork.graphql"
import { navigate } from "lib/navigation/navigate"
import { Size } from "lib/Scenes/Artwork/Components/ImageCarousel/geometry"
import { MyCollectionImageView } from "lib/Scenes/MyCollection/Components/MyCollectionImageView"
import { ScreenMargin } from "lib/Scenes/MyCollection/Components/ScreenMargin"
import { useDevToggle } from "lib/store/GlobalStore"
import { retrieveLocalImages } from "lib/utils/LocalImageStore"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Button, Flex, Spacer, Text } from "palette"
import React from "react"
import { TouchableOpacity } from "react-native"
import { createRefetchContainer, graphql, RelayRefetchProp } from "react-relay"
import { useTracking } from "react-tracking"
import useInterval from "react-use/lib/useInterval"
import {
  getBoundingBox,
  getImageMeasurements,
  hasImagesStillProcessing,
  imageIsProcessing,
  isImage,
} from "../../ArtworkForm/MyCollectionImageUtil"

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

  const showLocalImages = useDevToggle("DTMyCollectionShowLocalImages")

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

  const renderMainImageView = () => {
    const maxImageHeight = dimensions.height / 2.5
    const imageSize: Size = {
      height: defaultImage?.height ?? maxImageHeight,
      width: defaultImage?.width ?? dimensions.width,
    }
    const boundingBox = getBoundingBox(imageSize, maxImageHeight, dimensions)
    const { cumulativeScrollOffset, ...styles } = getImageMeasurements(imageSize, boundingBox)

    // remove all vertical margins for pics taken in landscape mode
    boundingBox.height = boundingBox.height - (styles.marginBottom + styles.marginTop)

    const imageURL = !imageIsProcessing(defaultImage as any, "normalized") ? defaultImage?.imageURL : undefined
    const normalizedURL = imageURL?.replace(":version", "normalized")

    return (
      <Flex bg="black5" alignItems="center">
        <MyCollectionImageView
          artworkSlug={slug}
          imageURL={normalizedURL}
          imageHeight={styles.height}
          imageWidth={styles.width}
          aspectRatio={styles.width / styles.height}
          mode="details"
        />
      </Flex>
    )
  }

  return (
    <>
      <ScreenMargin>
        <Text variant="lg">{artistNames}</Text>
        <Text variant="md" color="black60">
          {formattedTitleAndYear}
        </Text>
      </ScreenMargin>
      <Spacer my={1} />
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
            mr={2}
            style={{
              top: -50,
              alignItems: "flex-end",
            }}
          >
            <Flex
              py={0.5}
              px={2}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                borderRadius: 3,
              }}
            >
              <Text variant="xs">
                {images.length} photo{images.length > 1 ? "s" : ""}
              </Text>
            </Flex>
          </Flex>
        )}
      </TouchableOpacity>
      {!!showLocalImages && (
        <Button
          onPress={async () => {
            const localImages = await retrieveLocalImages(slug)
            navigate("/my-collection/local-images", {
              passProps: {
                images: localImages,
              },
            })
          }}
          block
        >
          Show Local Images
        </Button>
      )}
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
