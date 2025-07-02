import { Flex } from "@artsy/palette-mobile"
import { NewBuyNowArtworksRail_sale$key } from "__generated__/NewBuyNowArtworksRail_sale.graphql"
import { ArtworkRail } from "app/Components/ArtworkRail/ArtworkRail"
import { SectionTitle } from "app/Components/SectionTitle"
import { extractNodes } from "app/utils/extractNodes"
import { compact } from "lodash"
import { createFragmentContainer, graphql, useFragment } from "react-relay"

interface NewBuyNowArtworksRailProps {
  sale: NewBuyNowArtworksRail_sale$key
}

export const NewBuyNowArtworksRail: React.FC<NewBuyNowArtworksRailProps> = ({ sale }) => {
  const data = useFragment(fragment, sale)

  const artworks = extractNodes(data?.promotedSale?.artworksConnection)

  if (!artworks?.length) {
    return null
  }

  return (
    <Flex mt={4} testID="bnmo-rail-wrapper">
      <SectionTitle title="Artworks Available to Inquire" mx={2} />

      <ArtworkRail artworks={compact(artworks)} />
    </Flex>
  )
}

const fragment = graphql`
  fragment NewBuyNowArtworksRail_sale on Sale
  @argumentDefinitions(count: { type: "Int", defaultValue: 20 }, cursor: { type: "String" }) {
    internalID
    promotedSale {
      artworksConnection(first: $count, after: $cursor)
        @connection(key: "NewBuyNowArtworksRail_artworksConnection") {
        edges {
          node {
            ...ArtworkRail_artworks
          }
        }
      }
    }
  }
`

// TODO: Replace NewBuyNowArtworksRail with BuyNowArtworksRail when AREnableArtworksConnectionForAuction is released
export const NewBuyNowArtworksRailContainer = createFragmentContainer(NewBuyNowArtworksRail, {
  sale: fragment,
})
