import { Flex, Box, Text, Image } from "@artsy/palette-mobile"
import { ArtworkInfoSection_artwork$data } from "__generated__/ArtworkInfoSection_artwork.graphql"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { extractNodes } from "app/utils/extractNodes"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  artwork: ArtworkInfoSection_artwork$data
}

export const ArtworkInfoSection: React.FC<Props> = ({ artwork }) => {
  const showBlurhash = useFeatureFlag("ARShowBlurhashImagePlaceholder")
  const artworkItem = extractNodes(artwork.lineItems)[0].artwork

  if (!artworkItem) {
    return (
      <Text variant="sm" color="mono60">
        Related artwork has been deleted
      </Text>
    )
  }

  const { image, artistNames, title, dimensions, editionOf, date, medium } = artworkItem
  const addedComma = date ? ", " : ""

  return (
    <Flex flexDirection="row" justifyContent="space-between">
      {!!image?.url ? (
        <Box px={2}>
          <Image
            resizeMode="cover"
            src={image.url}
            width={60}
            height={60}
            blurhash={showBlurhash ? image.blurhash : undefined}
            testID="image"
          />
        </Box>
      ) : (
        <Box width={60} height={60} mx={2} />
      )}
      <Box style={{ flex: 1, flexShrink: 1 }}>
        <Text pb={1} variant="sm" testID="artistNames">
          {artistNames}
        </Text>
        <Text>
          <Text variant="sm" color="mono60" testID="title">
            {title + addedComma}
          </Text>
          <Text variant="sm" color="mono60" testID="date">
            {date}
          </Text>
        </Text>
        <Text variant="sm" color="mono60" testID="medium">
          {medium}
        </Text>
        {!!dimensions?.in && !!dimensions?.cm && (
          <Text variant="sm" color="mono60">
            {LegacyNativeModules.ARCocoaConstantsModule.CurrentLocale === "en_US"
              ? dimensions?.in
              : dimensions?.cm}
          </Text>
        )}

        {!!editionOf && (
          <Text testID="editionOf" variant="sm" color="mono60">
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
                url(version: "square")
                blurhash
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
