import { ArtworkInfoSection_artwork } from "__generated__/ArtworkInfoSection_artwork.graphql"
import { extractNodes } from "lib/utils/extractNodes"
import { Box, Flex, Text } from "palette"
import React from "react"
import { Image } from "react-native"
import { View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  artwork: ArtworkInfoSection_artwork
}

export const ArtworkInfoSection: React.FC<Props> = ({ artwork }) => {
  const artworkItem = extractNodes(artwork.lineItems)[0].artwork
  return (
    <Flex>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 14 }}>
        <Box style={{ marginHorizontal: 22 }}>
          {!!artworkItem?.image ? (
            <Image source={{ uri: artworkItem?.image?.resized?.url }} style={{ height: 50, width: 50 }} />
          ) : (
            <Box width={50} height={50} backgroundColor="black10" data-test-id="image-box" />
          )}
        </Box>
        <Box style={{ flex: 1, flexShrink: 1 }}>
          <Text mb={10} fontSize="size4" numberOfLines={1} fontWeight="bold">
            {artworkItem?.artist_names}
          </Text>
          <Text color="black60">{artworkItem?.title}</Text>
        </Box>
      </View>
    </Flex>
  )
}

export const ArtworkInfoSectionFragmentContainer = createFragmentContainer(ArtworkInfoSection, {
  artwork: graphql`
    fragment ArtworkInfoSection_artwork on CommerceOrder {
      lineItems {
        edges {
          node {
            artwork {
              image {
                resized(width: 55) {
                  url
                }
              }
              title
              artist_names: artistNames
            }
          }
        }
      }
    }
  `,
})
