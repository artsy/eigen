import { MyCollectionArtworkHeader_artwork } from "__generated__/MyCollectionArtworkHeader_artwork.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { navigate } from "lib/navigation/navigate"
import { ImageCarouselFragmentContainer } from "lib/Scenes/Artwork/Components/ImageCarousel/ImageCarousel"
import { ScreenMargin } from "lib/Scenes/MyCollection/Components/ScreenMargin"
import { Image } from "lib/Scenes/MyCollection/State/MyCollectionArtworkModel"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { ArtworkIcon, color, Flex, Spacer, Text } from "palette"
import React from "react"
import { Dimensions, TouchableOpacity } from "react-native"
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

  const hasImagesStillProcessing = (mainImage: any, imagesToCheck: MyCollectionArtworkHeader_artwork["images"]) => {
    if (!isImage(mainImage) || imageIsProcessing(mainImage)) {
      return true
    }

    if (!imagesToCheck) {
      return false
    }

    const concreteImages = imagesToCheck as Image[]
    const stillProcessing = concreteImages.some((image) => imageIsProcessing(image))
    return stillProcessing
  }

  const renderMainImageView = () => {
    if (!isImage(defaultImage) || imageIsProcessing(defaultImage)) {
      return (
        <Flex style={{ height: 300, alignItems: "center", justifyContent: "center", backgroundColor: color("black5") }}>
          <ArtworkIcon style={{ opacity: 0.6 }} height={100} width={100} />
          <Text style={{ opacity: 0.6 }}>
            {images && images?.length > 0 ? "Processing photos" : "Processing photo"}
          </Text>
        </Flex>
      )
    } else {
      const screenDimensions = Dimensions.get("screen")
      return (
        <Flex>
          <ImageCarouselFragmentContainer
            images={images as any /* STRICTNESS_MIGRATION */}
            cardHeight={screenDimensions.width >= 375 ? 340 : 290}
          />
        </Flex>
      )
      // return (
      //   <OpaqueImageView
      //     imageURL={defaultImage.url.replace(":version", "larger")}
      //     height={defaultImage.height * (dimensions.width / defaultImage.width)}
      //     width={dimensions.width}
      //   />
      // )
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
      {renderMainImageView()}
    </>
  )
}

export const MyCollectionArtworkHeaderFragmentContainer = createFragmentContainer(MyCollectionArtworkHeader, {
  artwork: graphql`
    fragment MyCollectionArtworkHeader_artwork on Artwork {
      artistNames
      date
      images {
        ...ImageCarousel_images
        isDefault
        imageURL
        internalID
      }
      internalID
      title
    }
  `,
})
