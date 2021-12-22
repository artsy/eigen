import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { Size } from "lib/Scenes/Artwork/Components/ImageCarousel/geometry"
import { LocalImage } from "lib/utils/LocalImageStore"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Flex, Spacer, Text } from "palette"
import React from "react"
import { Image as RNImage, ScrollView, View } from "react-native"
import { getBoundingBox } from "../ArtworkForm/MyCollectionImageUtil"

interface MyCollectionLocalArtworkImagesProps {
  images: LocalImage[]
}

export const MyCollectionLocalArtworkImages: React.FC<MyCollectionLocalArtworkImagesProps> = ({ images }) => {
  const dimensions = useScreenDimensions()

  const imageSize = (image: LocalImage) => {
    const maxImageHeight = dimensions.height / 2.5
    const localImageSize: Size = {
      width: image.width,
      height: image.height,
    }
    const size = getBoundingBox(localImageSize, maxImageHeight, dimensions)
    return size
  }

  if (!images || images.length === 0) {
    return (
      <Flex height="100%" flexDirection="row" alignItems="center" justifyContent="center">
        <Text>No local images stored for this artwork</Text>
      </Flex>
    )
  }

  return (
    <>
      <FancyModalHeader>Local Artwork Images</FancyModalHeader>
      <ScrollView>
        {images.map((image, index) => {
          const size = imageSize(image)
          return (
            <View key={index}>
              <RNImage
                testID="Image-Local"
                style={{ width: size.width, height: size.height, resizeMode: "cover" }}
                source={{ uri: image.path }}
              />
              <Spacer my={1} />
            </View>
          )
        })}
      </ScrollView>
    </>
  )
}
