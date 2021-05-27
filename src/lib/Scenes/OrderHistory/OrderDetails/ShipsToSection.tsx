import { ShipsToSection_artwork } from "__generated__/ShipsToSection_artwork.graphql"
import { extractNodes } from "lib/utils/extractNodes"
import { Box, Flex, Text } from "palette"
import React from "react"
import { Image } from "react-native"
import { View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  artwork: ShipsToSection_artwork
}

export const ShipsToSection: React.FC<Props> = ({ artwork }) => {
  const artworkItem = extractNodes(artwork.lineItems)[0].artwork
  return (
    <Flex>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 14 }}>
        <Box style={{ marginHorizontal: 22 }}>
          <Image source={{ uri: artworkItem?.image?.resized?.url }} style={{ height: 50, width: 50 }} />
        </Box>
        <Box style={{ flex: 1, flexShrink: 1 }}>
          <Box mb={10}>
            <Text fontSize="size4" numberOfLines={1} fontWeight="bold">
              {artworkItem?.artist_names}
            </Text>
          </Box>
          <Text color="black60">{artworkItem?.title}</Text>
        </Box>
      </View>
    </Flex>
  )
}

export const ShipsToSectionFragmentContainer = createFragmentContainer(ShipsToSection, {
  artwork: graphql`
    fragment ShipsToSection_artwork on CommerceOrder {
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
