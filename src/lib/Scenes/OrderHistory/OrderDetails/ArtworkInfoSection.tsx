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
        <Image
          source={{ uri: artworkItem?.image?.resized?.url }}
          style={{ height: 60, width: 60, marginHorizontal: 22 }}
        />
        <Box style={{ flex: 1, flexShrink: 1 }}>
          <Text pb={10} variant="mediumText">
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
