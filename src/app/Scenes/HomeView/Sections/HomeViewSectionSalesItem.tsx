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
  const sale = useFragment(fragment, saleProp)

  // representativeArtworks is a batched plain list (MP resolves it N+1-free); MP returns
  // [] for sales with no eligible lots, which compact() degrades to an empty stack.
  const imageURLs = (sale.representativeArtworks ?? []).map((artwork) => artwork.image?.url)
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
    representativeArtworks {
      image {
        url(version: "large")
      }
    }
  }
`
