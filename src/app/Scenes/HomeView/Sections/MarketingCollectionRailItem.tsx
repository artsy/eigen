import { Flex, Text } from "@artsy/palette-mobile"
import themeGet from "@styled-system/theme-get"
import { MarketingCollectionRailItem_marketingCollection$key } from "__generated__/MarketingCollectionRailItem_marketingCollection.graphql"
import { FiveUpImageLayout } from "app/Components/FiveUpImageLayout"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { compact } from "lodash"
import { FC } from "react"
import { graphql, useFragment } from "react-relay"
import styled from "styled-components/native"

interface MarketingCollectionRailItemProps {
  marketingCollection: MarketingCollectionRailItem_marketingCollection$key
}

export const MarketingCollectionRailItem: FC<MarketingCollectionRailItemProps> = ({
  marketingCollection: marketingCollectionFragment,
}) => {
  const marketingCollection = useFragment(fragment, marketingCollectionFragment)

  // Collections are expected to always have >= 2 artworks, but we should
  // still be cautious to avoid crashes if this assumption is broken.
  const artworkImageURLs = compact(
    extractNodes(marketingCollection.artworksConnection, (artwork) => artwork.image?.url)
  )

  return (
    // eslint-disable-next-line react/jsx-no-undef
    <CollectionCard
      testID={`collections-rail-card-${marketingCollection.slug}`}
      onPress={
        marketingCollection?.slug
          ? () => {
              navigate(`/collection/${marketingCollection.slug}`)
            }
          : undefined
      }
    >
      <Flex>
        <FiveUpImageLayout imageURLs={artworkImageURLs} />

        <Flex mt={1}>
          <Text variant="sm-display" numberOfLines={1} weight="medium">
            {marketingCollection?.title}
          </Text>
          <Text variant="xs" numberOfLines={1} color="black60">
            {marketingCollection?.artworksConnection?.counts?.total
              ? `${marketingCollection.artworksConnection.counts.total} works`
              : ""}
          </Text>
        </Flex>
      </Flex>
    </CollectionCard>
  )
}

const fragment = graphql`
  fragment MarketingCollectionRailItem_marketingCollection on MarketingCollection {
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

const CollectionCard = styled.TouchableHighlight.attrs(() => ({
  underlayColor: themeGet("colors.white100"),
  activeOpacity: 0.8,
}))``
