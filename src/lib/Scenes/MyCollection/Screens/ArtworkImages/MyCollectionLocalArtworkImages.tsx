import { MyCollectionArtworkImagesQuery } from "__generated__/MyCollectionArtworkImagesQuery.graphql"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { Size } from "lib/Scenes/Artwork/Components/ImageCarousel/geometry"
import { LocalImage } from "lib/utils/LocalImageStore"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Flex, Spacer } from "palette"
import React from "react"
import { ActivityIndicator, Image, ScrollView, View } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
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

  if (!images) {
    return null
  }

  return (
    <>
      <FancyModalHeader>Artwork Images</FancyModalHeader>
      <ScrollView>
        {images.map((image, index) => {
          const size = imageSize(image)
          return (
            <View key={index}>
              <Image
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

const MyCollectionArtworkImagesFragmentContainer = createFragmentContainer(MyCollectionArtworkImages, {
  artworkImages: graphql`
    fragment MyCollectionArtworkImages_artwork on Artwork {
      images {
        height
        isDefault
        imageURL
        width
        internalID
      }
    }
  `,
})

export const MyCollectionArtworkImagesQueryRenderer: React.FC<{
  artworkSlug: string
}> = ({ artworkSlug }) => {
  return (
    <QueryRenderer<MyCollectionArtworkImagesQuery>
      environment={defaultEnvironment}
      query={graphql`
        query MyCollectionArtworkImagesQuery($artworkSlug: String!) {
          artwork(id: $artworkSlug) {
            ...MyCollectionArtworkImages_artwork
          }
        }
      `}
      variables={{
        artworkSlug,
      }}
      render={renderWithPlaceholder({
        Container: MyCollectionArtworkImagesFragmentContainer,
        renderPlaceholder: () => (
          <Flex flexGrow={1}>
            <FancyModalHeader>Artwork Images</FancyModalHeader>
            <Flex alignItems="center" justifyContent="center" flexGrow={1}>
              <ActivityIndicator />
            </Flex>
          </Flex>
        ),
      })}
    />
  )
}
