import { Box, Text } from "@artsy/palette-mobile"
import { CollectionHeader_collection$key } from "__generated__/CollectionHeader_collection.graphql"
import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { Dimensions } from "react-native"
import { graphql, useFragment } from "react-relay"

interface CollectionHeaderProps {
  collection: CollectionHeader_collection$key
}

const HEADER_IMAGE_HEIGHT = 204

export const CollectionHeader: React.FC<CollectionHeaderProps> = ({ collection }) => {
  const data = useFragment(fragment, collection)

  const { title, image, headerImage } = data
  const defaultHeaderUrl = image?.edges?.[0]?.node?.image?.url || ""
  const url = headerImage ? headerImage : defaultHeaderUrl
  const { width: screenWidth } = Dimensions.get("window")

  return (
    <>
      <Box mb={2} pointerEvents="none">
        <OpaqueImageView imageURL={url} height={HEADER_IMAGE_HEIGHT} width={screenWidth} />
      </Box>
      <Box mb={2} pointerEvents="none">
        <Text variant="lg-display" mx={2}>
          {title}
        </Text>
      </Box>
    </>
  )
}

const fragment = graphql`
  fragment CollectionHeader_collection on MarketingCollection {
    title
    headerImage
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
