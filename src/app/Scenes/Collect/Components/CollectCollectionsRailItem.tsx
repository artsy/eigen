import { Flex, Image, Text } from "@artsy/palette-mobile"
import {
  CollectCollectionsRailItem_marketingCollection$data,
  CollectCollectionsRailItem_marketingCollection$key,
} from "__generated__/CollectCollectionsRailItem_marketingCollection.graphql"
import { RouterLink } from "app/system/navigation/RouterLink"
import { graphql, useFragment } from "react-relay"

interface CollectCollectionsRailItemProps {
  marketingCollection: CollectCollectionsRailItem_marketingCollection$key
  onPress?: (marketingCollection: CollectCollectionsRailItem_marketingCollection$data) => void
}

export const COLLECTION_CONTAINER_WIDTH = 250
export const COLLECTION_CONTAINER_HEIGHT = 140

export const CollectCollectionsRailItem: React.FC<CollectCollectionsRailItemProps> = (props) => {
  const marketingCollection = useFragment(collectionsFragment, props.marketingCollection)

  return (
    <RouterLink
      onPress={
        marketingCollection?.slug
          ? () => {
              props.onPress?.(marketingCollection)
            }
          : undefined
      }
      testID={`collections-rail-card-${marketingCollection.slug}`}
      to={`/collection/${marketingCollection.slug}`}
    >
      <Flex width={COLLECTION_CONTAINER_WIDTH}>
        <Image
          src={marketingCollection.thumbnailImage?.url ?? ""}
          height={COLLECTION_CONTAINER_HEIGHT}
          width={COLLECTION_CONTAINER_WIDTH}
          resizeMode="cover"
        />

        <Flex mt={1}>
          <Text variant="sm-display" weight="medium">
            {marketingCollection?.title}
          </Text>
        </Flex>
      </Flex>
    </RouterLink>
  )
}

const collectionsFragment = graphql`
  fragment CollectCollectionsRailItem_marketingCollection on MarketingCollection {
    internalID
    title
    slug
    thumbnail
    thumbnailImage {
      url(version: "large")
    }
  }
`
