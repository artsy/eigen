import { Flex } from "@artsy/palette-mobile"
import { NewBuyNowArtworksRail_sale$data } from "__generated__/NewBuyNowArtworksRail_sale.graphql"
import { ArtworkRail } from "app/Components/ArtworkRail/ArtworkRail"
import { SectionTitle } from "app/Components/SectionTitle"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { compact } from "lodash"
import { createFragmentContainer, graphql } from "react-relay"

interface NewBuyNowArtworksRailProps {
  sale: NewBuyNowArtworksRail_sale$data
}

export const NewBuyNowArtworksRail: React.FC<NewBuyNowArtworksRailProps> = ({ sale }) => {
  const artworks = extractNodes(sale.promotedSale?.artworksConnection)

  if (!artworks?.length) {
    return null
  }

  return (
    <Flex mt={4} testID="bnmo-rail-wrapper">
      <Flex mx={2}>
        <SectionTitle title="Artworks Available to Inquire" />
      </Flex>
      <ArtworkRail
        artworks={compact(artworks)}
        onPress={(artwork) => {
          if (artwork?.href) {
            navigate(artwork.href)
          }
        }}
      />
    </Flex>
  )
}

// TODO: Replace NewBuyNowArtworksRail with BuyNowArtworksRail when AREnableArtworksConnectionForAuction is released
export const NewBuyNowArtworksRailContainer = createFragmentContainer(NewBuyNowArtworksRail, {
  sale: graphql`
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
  `,
})
