import { Text } from "@artsy/palette-mobile"
import {
  HomeViewSectionSalesItem_sale$data,
  HomeViewSectionSalesItem_sale$key,
} from "__generated__/HomeViewSectionSalesItem_sale.graphql"

import {
  CardRailCard,
  CardRailMetadataContainer as MetadataContainer,
} from "app/Components/CardRail/CardRailCard"
import { MultipleImageLayout } from "app/Components/MultipleImageLayout"
import { RouterLink } from "app/system/navigation/RouterLink"
import { extractNodes } from "app/utils/extractNodes"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { compact } from "lodash"
import { FC } from "react"
import { graphql, useFragment } from "react-relay"

interface HomeViewSectionSalesItemProps {
  sale: HomeViewSectionSalesItem_sale$key
  onPress?: (sale: HomeViewSectionSalesItem_sale$data) => void
}

export const HomeViewSectionSalesItem: FC<HomeViewSectionSalesItemProps> = ({
  sale: saleProp,
  onPress,
}) => {
  const isArtworksConnectionEnabled = useFeatureFlag("AREnableArtworksConnectionForAuction")
  const sale = useFragment(fragment, saleProp)

  let imageURLs

  if (isArtworksConnectionEnabled) {
    imageURLs = extractNodes(sale.artworksConnection, (artwork) => artwork.image?.url)
  } else {
    imageURLs = extractNodes(sale.saleArtworksConnection, (artwork) => artwork.artwork?.image?.url)
  }

  // Sales are expected to always have >= 2 artworks, but we should
  // still be cautious to avoid crashes if this assumption is broken.
  const availableArtworkImageURLs = compact(imageURLs)

  const url = sale.liveURLIfOpen ?? sale.href

  return (
    <CardRailCard key={sale.href}>
      <RouterLink to={url} onPress={() => onPress?.(sale)}>
        <MultipleImageLayout imageURLs={availableArtworkImageURLs} />
        <MetadataContainer>
          <Text numberOfLines={2} lineHeight="20px" variant="sm">
            {sale.name}
          </Text>
          <Text
            numberOfLines={1}
            lineHeight="20px"
            color="mono60"
            variant="sm"
            ellipsizeMode="middle"
          >
            {sale.formattedStartDateTime}
          </Text>
        </MetadataContainer>
      </RouterLink>
    </CardRailCard>
  )
}

const fragment = graphql`
  fragment HomeViewSectionSalesItem_sale on Sale {
    href
    name
    liveURLIfOpen
    formattedStartDateTime
    internalID
    slug
    saleArtworksConnection(first: 3) {
      edges {
        node {
          artwork {
            image {
              url(version: "large")
            }
          }
        }
      }
    }
    artworksConnection(first: 3) {
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
