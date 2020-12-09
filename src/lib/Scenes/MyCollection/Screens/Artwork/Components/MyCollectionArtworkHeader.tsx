import { MyCollectionArtworkHeader_artwork } from "__generated__/MyCollectionArtworkHeader_artwork.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { navigate } from "lib/navigation/navigate"
import { ScreenMargin } from "lib/Scenes/MyCollection/Components/ScreenMargin"
import { Image } from "lib/Scenes/MyCollection/State/MyCollectionArtworkModel"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { ArtworkIcon, color, Flex, Spacer, Text } from "palette"
import React from "react"
import { TouchableOpacity } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { opacity } from "styled-system"

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

  const processingText = () => {
    return images && images?.length > 0 ? "Processing photos" : "Processing photo"
  }

  const imageViewHeight = (fullHeight: number, fullWidth: number, constrainedWidth: number) => {
    const screenHeightPercent = 0.65
    return fullHeight * (constrainedWidth / fullWidth) * screenHeightPercent
  }

  const MainImageView = () => {
    if (!isImage(defaultImage) || imageIsProcessing(defaultImage)) {
      return (
        <Flex
          style={{ height: 300, alignItems: "center", justifyContent: "center", backgroundColor: color("black10") }}
        >
          <ArtworkIcon style={{ opacity: 0.6 }} height={100} width={100} />
          <Text style={{ opacity: 0.6 }}>{processingText()}</Text>
        </Flex>
      )
    } else {
      // TODO: figure out if "normalized" is the correct version
      return (
        <OpaqueImageView
          imageURL={defaultImage.url.replace(":version", "normalized")}
          height={imageViewHeight(defaultImage.height, defaultImage.width, dimensions.width)}
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
      <Spacer my={1} />
      <TouchableOpacity onPress={() => navigate(`/my-collection/artwork-images/${internalID}`)}>
        <MainImageView />
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
