import { MyCollectionArtworkImages_artwork } from "__generated__/MyCollectionArtworkImages_artwork.graphql"
import { MyCollectionArtworkImagesQuery } from "__generated__/MyCollectionArtworkImagesQuery.graphql"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Flex, Spacer } from "palette"
import React from "react"
import { ActivityIndicator, ScrollView, View } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"

interface MyCollectionArtworkImagesProps {
  artwork: MyCollectionArtworkImages_artwork
}

const MyCollectionArtworkImages: React.FC<MyCollectionArtworkImagesProps> = ({ artwork }) => {
  const { images } = artwork
  const dimensions = useScreenDimensions()

  if (!images) {
    return null
  }

  return (
    <>
      <FancyModalHeader>Artwork Images</FancyModalHeader>
      <ScrollView>
        {images.map((image, index) => (
          <View key={index}>
            <OpaqueImageView
              // TODO: figure out if "normalized" is the correct version
              imageURL={image!.imageURL?.replace(":version", "normalized")}
              height={(dimensions.width / (image!.width || 1)) * (image!.height || 1)}
              width={dimensions.width}
            />
            <Spacer my="1" />
          </View>
        ))}
      </ScrollView>
    </>
  )
}

const MyCollectionArtworkImagesFragmentContainer = createFragmentContainer(MyCollectionArtworkImages, {
  artwork: graphql`
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
