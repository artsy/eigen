import { ItemArtwork_artwork$data } from "__generated__/ItemArtwork_artwork.graphql"
import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { navigate } from "app/navigation/navigate"
import { Box, Flex, Separator, Text, Touchable } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface ItemArtworkProps {
  artwork: ItemArtwork_artwork$data
}

export const ItemArtwork: React.FC<ItemArtworkProps> = ({ artwork }) => {
  return (
    <>
      <Flex flexDirection="column" p={2}>
        <Text variant="md" mb={2} weight="medium">
          Artwork
        </Text>

        <Touchable onPress={() => artwork.href && navigate(artwork.href)}>
          <Flex flexDirection="row">
            <Box height="100px" width="100px" justifyContent="center" backgroundColor="pink">
              <OpaqueImageView
                testID="artworkImage"
                imageURL={artwork.image?.thumbnailUrl}
                width={100}
                height={100}
              />
            </Box>

            <Flex flexDirection="column" ml={2} flexShrink={1}>
              <Text variant="sm" numberOfLines={1}>
                {artwork.artistNames}
              </Text>
              <Text variant="sm" color="black60" numberOfLines={1} italic>
                {[artwork.title, artwork.date].join(", ")}
              </Text>
              {!!artwork.partner?.name && (
                <Text variant="sm" color="black60" numberOfLines={1}>
                  {artwork.partner.name}
                </Text>
              )}
              <Text variant="sm" numberOfLines={1}>
                {artwork.saleMessage === "Contact For Price"
                  ? "Price on request"
                  : artwork.saleMessage}
              </Text>
            </Flex>
          </Flex>
        </Touchable>
      </Flex>
      <Separator my={1} />
    </>
  )
}

export const ItemArtworkFragmentContainer = createFragmentContainer(ItemArtwork, {
  artwork: graphql`
    fragment ItemArtwork_artwork on Artwork {
      href
      image {
        thumbnailUrl: url(version: "small")
      }
      title
      artistNames
      date
      saleMessage
      partner {
        name
      }
    }
  `,
})
