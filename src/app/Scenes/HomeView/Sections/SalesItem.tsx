import { Text } from "@artsy/palette-mobile"
import {
  SalesRailItem_sale$data,
  SalesRailItem_sale$key,
} from "__generated__/SalesRailItem_sale.graphql"
import {
  CardRailCard,
  CardRailMetadataContainer as MetadataContainer,
} from "app/Components/Home/CardRailCard"
import { ThreeUpImageLayout } from "app/Components/ThreeUpImageLayout"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { compact } from "lodash"
import { FC } from "react"
import { View } from "react-native"
import { graphql, useFragment } from "react-relay"

interface SalesItemProps {
  sale: SalesRailItem_sale$key
  onPress?: (sale: SalesRailItem_sale$data) => void
}

export const SalesItem: FC<SalesItemProps> = ({ sale: saleProp, onPress }) => {
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

  return (
    <CardRailCard
      key={sale.href}
      onPress={() => {
        const url = sale.liveURLIfOpen ?? sale.href

        onPress?.(sale)

        if (url) {
          navigate(url)
        }
      }}
    >
      <View>
        <ThreeUpImageLayout imageURLs={availableArtworkImageURLs} />
        <MetadataContainer>
          <Text numberOfLines={2} lineHeight="20px" variant="sm">
            {sale.name}
          </Text>
          <Text
            numberOfLines={1}
            lineHeight="20px"
            color="black60"
            variant="sm"
            ellipsizeMode="middle"
          >
            {sale.formattedStartDateTime}
          </Text>
        </MetadataContainer>
      </View>
    </CardRailCard>
  )
}

const fragment = graphql`
  fragment SalesItem_sale on Sale {
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
