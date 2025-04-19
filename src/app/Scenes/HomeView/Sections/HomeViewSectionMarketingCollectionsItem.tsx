import { Flex, Text } from "@artsy/palette-mobile"
import {
  HomeViewSectionMarketingCollectionsItem_marketingCollection$data,
  HomeViewSectionMarketingCollectionsItem_marketingCollection$key,
} from "__generated__/HomeViewSectionMarketingCollectionsItem_marketingCollection.graphql"
import { FiveUpImageLayout } from "app/Components/FiveUpImageLayout"
import { RouterLink } from "app/system/navigation/RouterLink"
import { extractNodes } from "app/utils/extractNodes"
import { pluralize } from "app/utils/pluralize"
import { compact } from "lodash"
import { FC } from "react"
import { graphql, useFragment } from "react-relay"

interface HomeViewSectionMarketingCollectionsItemProps {
  marketingCollection: HomeViewSectionMarketingCollectionsItem_marketingCollection$key
  onPress?: (
    marketingCollection: HomeViewSectionMarketingCollectionsItem_marketingCollection$data
  ) => void
}

export const HomeViewSectionMarketingCollectionsItem: FC<
  HomeViewSectionMarketingCollectionsItemProps
> = ({ marketingCollection: marketingCollectionFragment, onPress }) => {
  const marketingCollection = useFragment(fragment, marketingCollectionFragment)

  // Collections are expected to always have >= 2 artworks, but we should
  // still be cautious to avoid crashes if this assumption is broken.
  const artworkImageURLs = compact(
    extractNodes(marketingCollection.artworksConnection, (artwork) => artwork.image?.url)
  )

  const artworksCount = marketingCollection.artworksConnection?.counts?.total || 0

  return (
    <RouterLink
      onPress={
        marketingCollection?.slug
          ? () => {
              onPress?.(marketingCollection)
            }
          : undefined
      }
      testID={`collections-rail-card-${marketingCollection.slug}`}
      to={`/collection/${marketingCollection.slug}`}
    >
      <Flex>
        <FiveUpImageLayout imageURLs={artworkImageURLs} />

        <Flex mt={1}>
          <Text variant="sm-display" numberOfLines={1} weight="medium">
            {marketingCollection?.title}
          </Text>
          <Text variant="xs" numberOfLines={1} color="mono60">
            {marketingCollection?.artworksConnection?.counts?.total
              ? `${marketingCollection.artworksConnection.counts.total} ${pluralize(
                  "work",
                  artworksCount
                )}`
              : ""}
          </Text>
        </Flex>
      </Flex>
    </RouterLink>
  )
}

const fragment = graphql`
  fragment HomeViewSectionMarketingCollectionsItem_marketingCollection on MarketingCollection {
    internalID
    title
    slug
    artworksConnection(first: 5, sort: "-decayed_merch") {
      counts {
        total
      }
      edges {
        node {
          image {
            url(version: "large")
          }
        }
      }
    }
  }
`
