import { MyCollectionArtworkHeader_artwork } from "__generated__/MyCollectionArtworkHeader_artwork.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { navigate } from "lib/navigation/navigate"
import { ScreenMargin } from "lib/Scenes/MyCollection/Components/ScreenMargin"
import { Image } from "lib/Scenes/MyCollection/State/MyCollectionArtworkModel"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Flex, Spacer, Text } from "palette"
import React from "react"
import { TouchableOpacity } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface MyCollectionArtworkHeaderProps {
  artwork: MyCollectionArtworkHeader_artwork
}

const MyCollectionArtworkHeader: React.FC<MyCollectionArtworkHeaderProps> = (props) => {
  const {
    artwork: { artistNames, date, images, internalID, title },
  } = props
  const dimensions = useScreenDimensions()
  const formattedTitleAndYear = [title, date].filter(Boolean).join(", ")

  const defaultImage = images?.find((i) => i?.isDefault) || (images && images[0])

  const isImage = (toCheck: any): toCheck is Image => !!toCheck

  const imageIsProcessing = (image: Image | null) => {
    if (!image) {
      return false
    }

    const isProcessing = image.height === null
    return isProcessing
  }

  const hasImagesStillProcessing = (imagesToCheck: MyCollectionArtworkHeader_artwork["images"]) => {
    if (!imagesToCheck) {
      return false
    }

    const concreteImages = imagesToCheck as Image[]
    const stillProcessing = concreteImages.filter((image) => imageIsProcessing(image)).length > 0
    return stillProcessing
  }

  return (
    <>
      <ScreenMargin>
        <Text variant="largeTitle">{artistNames}</Text>
        <Text variant="subtitle" color="black60">
          {formattedTitleAndYear}
        </Text>
      </ScreenMargin>

      <Spacer my={1} />

      <TouchableOpacity onPress={() => navigate(`/my-collection/artwork-images/${internalID}`)}>
        {!!isImage(defaultImage) && !imageIsProcessing(defaultImage) && (
          <OpaqueImageView
            // TODO: figure out if "normalized" is the correct version
            imageURL={defaultImage.url.replace(":version", "normalized")}
            height={defaultImage.height * (dimensions.width / defaultImage.width)}
            width={dimensions.width}
          />
        )}
        {!!images && !hasImagesStillProcessing(images) && (
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

export const MyCollectionArtworkHeaderFragmentContainer = createFragmentContainer(MyCollectionArtworkHeader, {
  artwork: graphql`
    fragment MyCollectionArtworkHeader_artwork on Artwork {
      artistNames
      date
      images {
        height
        isDefault
        url
        width
      }
      internalID
      title
    }
  `,
})
