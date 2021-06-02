import { ArtworkInfoSection_artwork } from "__generated__/ArtworkInfoSection_artwork.graphql"
import { LegacyNativeModules } from "lib/NativeModules/LegacyNativeModules"
import { extractNodes } from "lib/utils/extractNodes"
import { Box, Flex, Text } from "palette"
import React from "react"
import { Image } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  artwork: ArtworkInfoSection_artwork
  testID?: string
}

export const ArtworkInfoSection: React.FC<Props> = ({ artwork }) => {
  console.log(artwork, "artwork")
  const artworkItem = extractNodes(artwork.lineItems)[0].artwork
  if (!artworkItem) {
    return null
  }

  const { image, artistNames, title, dimensions, editionOf, date, medium } = artworkItem
  const addedComma = date ? ", " : ""

  return (
    <Flex>
      <Flex style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {!!image?.url ? (
          <Image
            resizeMode="contain"
            source={{ uri: image.url }}
            style={{ height: 60, width: 60, marginHorizontal: 22 }}
            testID="image"
          />
        ) : (
          <Box width={60} height={60} backgroundColor="black10" />
        )}
        <Box style={{ flex: 1, flexShrink: 1 }}>
          <Text pb={10} variant="mediumText" testID="artistNames">
            {artistNames}
          </Text>
          <Text>
            <Text variant="text" color="black60" testID="title">
              {title + addedComma}
            </Text>
            <Text variant="text" color="black60" testID="date">
              {date}
            </Text>
          </Text>
          <Text variant="text" color="black60" testID="medium">
            {medium}
          </Text>
          {!!dimensions!.in && !!dimensions!.cm && (
            <Text variant="text" color="black60">
              {LegacyNativeModules.ARCocoaConstantsModule.CurrentLocale === "en_US" ? dimensions!.in : dimensions!.cm}
            </Text>
          )}

          {!!editionOf && (
            <Text testID="editionOf" variant="text" color="black60">
              {editionOf}
            </Text>
          )}
        </Box>
      </Flex>
    </Flex>
  )
}

export const ArtworkInfoSectionFragmentContainer = createFragmentContainer(ArtworkInfoSection, {
  artwork: graphql`
    fragment ArtworkInfoSection_artwork on CommerceOrder {
      lineItems(first: 1) {
        edges {
          node {
            artwork {
              medium
              editionOf
              dimensions {
                in
                cm
              }
              date
              image {
                url(version: "square60")
              }
              title
              artistNames
            }
          }
        }
      }
    }
  `,
})
