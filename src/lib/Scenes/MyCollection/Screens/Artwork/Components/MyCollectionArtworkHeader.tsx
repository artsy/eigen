import { MyCollectionArtworkHeader_artwork } from "__generated__/MyCollectionArtworkHeader_artwork.graphql"
import { ImageCarouselFragmentContainer } from "lib/Scenes/Artwork/Components/ImageCarousel/ImageCarousel"
import { ScreenMargin } from "lib/Scenes/MyCollection/Components/ScreenMargin"
import { Image } from "lib/Scenes/MyCollection/State/MyCollectionArtworkModel"
import { ArtworkIcon, color, Flex, Spacer, Text } from "palette"
import React from "react"
import { Dimensions } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface MyCollectionArtworkHeaderProps {
  artwork: MyCollectionArtworkHeader_artwork
}

const MyCollectionArtworkHeader: React.FC<MyCollectionArtworkHeaderProps> = (props) => {
  const {
    artwork: { artistNames, date, images, title },
  } = props
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
