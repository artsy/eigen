import { MyCollectionArtworkHeader_artwork } from "__generated__/MyCollectionArtworkHeader_artwork.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { ScreenMargin } from "lib/Scenes/MyCollection/Components/ScreenMargin"
import { AppStore } from "lib/store/AppStore"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Flex, Spacer, Text } from "palette"
import React from "react"
import { TouchableOpacity, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface MyCollectionArtworkHeaderProps {
  artwork: MyCollectionArtworkHeader_artwork
}

const MyCollectionArtworkHeader: React.FC<MyCollectionArtworkHeaderProps> = (props) => {
  const {
    artwork: { artistNames, date, images, title },
  } = props
  const dimensions = useScreenDimensions()
  const formattedTitleAndYear = [title, date].filter(Boolean).join(", ")

  const navActions = AppStore.actions.myCollection.navigation
  const defaultImage = images?.find((i) => i.isDefault) || (images && images[0])

  return (
    <>
      <ScreenMargin>
        <Text variant="largeTitle">{artistNames}</Text>
        <Text variant="subtitle" color="black60">
          {formattedTitleAndYear}
        </Text>
      </ScreenMargin>

      <Spacer my={1} />

      <TouchableOpacity
        onPress={() =>
          navActions.navigateToViewAllArtworkImages({
            passProps: {
              images,
            },
          })
        }
      >
        {!!defaultImage && (
          <OpaqueImageView
            // TODO: figure out if "normalized" is the correct version
            imageURL={defaultImage.url.replace(":version", "normalized")}
            height={defaultImage.height * (dimensions.width / defaultImage.width)}
            width={dimensions.width}
          />
        )}
        {!!images && (
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
      title
    }
  `,
})
