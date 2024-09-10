import { Box, Text } from "@artsy/palette-mobile"
import { CollectionHeader_collection$key } from "__generated__/CollectionHeader_collection.graphql"
import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { ReadMore } from "app/Components/ReadMore"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { Schema } from "app/utils/track"
import { Dimensions } from "react-native"
import { isTablet } from "react-native-device-info"
import { graphql, useFragment } from "react-relay"

interface CollectionHeaderProps {
  collection: CollectionHeader_collection$key
}

const HEADER_IMAGE_HEIGHT = 204

export const CollectionHeader: React.FC<CollectionHeaderProps> = ({ collection }) => {
  const data = useFragment(fragment, collection)

  const shouldHideHeaderImage = useFeatureFlag("AREnableCollectionsWithoutHeaderImage")
  const { title, image, headerImage, descriptionMarkdown } = data
  const defaultHeaderUrl = image?.edges?.[0]?.node?.image?.url || ""
  const url = headerImage ? headerImage : defaultHeaderUrl
  const { width: screenWidth } = Dimensions.get("window")

  return (
    <>
      {!shouldHideHeaderImage && (
        <Box mb={2} pointerEvents="none">
          <OpaqueImageView imageURL={url} height={HEADER_IMAGE_HEIGHT} width={screenWidth} />
        </Box>
      )}
      <Box mb={2} pointerEvents="none">
        <Text variant="lg-display" mx={2}>
          {title}
        </Text>
      </Box>
      {!!descriptionMarkdown && (
        <Box mx={2} my={0.5} accessibilityLabel="Read more">
          <ReadMore
            content={descriptionMarkdown}
            maxChars={isTablet() ? 300 : 250} // truncate at 300 characters on iPads and 250 on all other devices
            contextModule={Schema.ContextModules.CollectionDescription}
            trackingFlow={Schema.Flow.AboutTheCollection}
            textStyle="sans"
          />
        </Box>
      )}
    </>
  )
}

const fragment = graphql`
  fragment CollectionHeader_collection on MarketingCollection {
    title
    headerImage
    descriptionMarkdown
    image: artworksConnection(sort: "-decayed_merch", first: 1) {
      edges {
        node {
          image {
            url(version: "larger")
          }
        }
      }
    }
  }
`
