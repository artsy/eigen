import { ArtworkInfoSection_artwork$data } from "__generated__/ArtworkInfoSection_artwork.graphql"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { extractNodes } from "app/utils/extractNodes"
import { Box, Flex, Text } from "palette"
import React from "react"
import { Image } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  artwork: ArtworkInfoSection_artwork$data
}

export const ArtworkInfoSection: React.FC<Props> = ({ artwork }) => {
  const artworkItem = extractNodes(artwork.lineItems)[0].artwork
  if (!artworkItem) {
    return (
      <Text variant="sm" color="black60">
        Related artwork has been deleted
      </Text>
    )
  }

  const { image, artistNames, title, dimensions, editionOf, date, medium } = artworkItem
  const addedComma = date ? ", " : ""

  return (
    <Flex flexDirection="row" justifyContent="space-between">
      {!!image?.url ? (
        <Image
          resizeMode="contain"
          source={{ uri: image.url }}
          style={{ height: 60, width: 60, marginHorizontal: 22 }}
          testID="image"
        />
      ) : (
        <Box width={60} height={60} marginX={22} backgroundColor="black10" />
      )}
      <Box style={{ flex: 1, flexShrink: 1 }}>
        <Text pb={1} variant="sm" testID="artistNames">
          {artistNames}
        </Text>
        <Text>
          <Text variant="sm" color="black60" testID="title">
            {title + addedComma}
          </Text>
          <Text variant="sm" color="black60" testID="date">
            {date}
          </Text>
        </Text>
        <Text variant="sm" color="black60" testID="medium">
          {medium}
        </Text>
        {!!dimensions?.in && !!dimensions?.cm && (
          <Text variant="sm" color="black60">
            {LegacyNativeModules.ARCocoaConstantsModule.CurrentLocale === "en_US"
              ? dimensions!.in
              : dimensions!.cm}
          </Text>
        )}

        {!!editionOf && (
          <Text testID="editionOf" variant="sm" color="black60">
            {editionOf}
          </Text>
        )}
      </Box>
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
