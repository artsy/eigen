import { Flex } from "@artsy/palette-mobile"
import { BuyNowArtworksRail_sale$data } from "__generated__/BuyNowArtworksRail_sale.graphql"
import { ArtworkRail } from "app/Components/ArtworkRail/ArtworkRail"
import { SectionTitle } from "app/Components/SectionTitle"
import { extractNodes } from "app/utils/extractNodes"
import { compact } from "lodash"
import { createFragmentContainer, graphql } from "react-relay"

interface BuyNowArtworksRailProps {
  sale: BuyNowArtworksRail_sale$data
}

export const BuyNowArtworksRail: React.FC<BuyNowArtworksRailProps> = ({ sale }) => {
  const artworks = extractNodes(sale.promotedSale?.saleArtworksConnection).map(
    (saleArtwork) => saleArtwork.artwork
  )

  if (!artworks?.length) {
    return null
  }

  return (
    <Flex mt={4} testID="bnmo-rail-wrapper">
      <Flex mx={2}>
        <SectionTitle title="Artworks Available to Inquire" />
      </Flex>
      <ArtworkRail artworks={compact(artworks)} />
    </Flex>
  )
}

export const BuyNowArtworksRailContainer = createFragmentContainer(BuyNowArtworksRail, {
  sale: graphql`
    fragment BuyNowArtworksRail_sale on Sale
    @argumentDefinitions(count: { type: "Int", defaultValue: 20 }, cursor: { type: "String" }) {
      internalID
      promotedSale {
        saleArtworksConnection(first: $count, after: $cursor)
          @connection(key: "Sale_saleArtworksConnection") {
          edges {
            node {
              artwork {
                ...ArtworkRail_artworks
              }
            }
          }
        }
      }
    }
  `,
})
