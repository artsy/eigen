import { OwnerType } from "@artsy/cohesion"
import { SaleArtworksRail_me$data } from "__generated__/SaleArtworksRail_me.graphql"
import { CardRailFlatList } from "app/Components/Home/CardRailFlatList"
import { SaleArtworkTileRailCardContainer } from "app/Components/SaleArtworkTileRailCard"
import { SectionTitle } from "app/Components/SectionTitle"
import { navigate } from "app/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { Flex } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  me: SaleArtworksRail_me$data
}

export const INITIAL_NUMBER_TO_RENDER = 4

export const SaleArtworksRail: React.FC<Props> = ({ me }) => {
  const artworks = extractNodes(me?.lotsByFollowedArtistsConnection)

  if (!artworks?.length) {
    return null
  }

  return (
    <Flex mt={3}>
      <Flex mx={2} my={1}>
        <SectionTitle title="Lots by artists you follow" />
      </Flex>
      <CardRailFlatList
        data={artworks}
        initialNumToRender={INITIAL_NUMBER_TO_RENDER}
        windowSize={3}
        renderItem={({ item: artwork }) => (
          <SaleArtworkTileRailCardContainer
            onPress={() => {
              navigate(artwork.href!)
            }}
            saleArtwork={artwork.saleArtwork!}
            useSquareAspectRatio
            useCustomSaleMessage
            contextScreenOwnerType={OwnerType.sale}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </Flex>
  )
}

export const SaleArtworksRailContainer = createFragmentContainer(SaleArtworksRail, {
  me: graphql`
    fragment SaleArtworksRail_me on Me @argumentDefinitions(saleID: { type: "ID" }) {
      lotsByFollowedArtistsConnection(
        first: 10
        includeArtworksByFollowedArtists: true
        saleID: $saleID
      ) {
        edges {
          node {
            id
            href
            saleArtwork {
              ...SaleArtworkTileRailCard_saleArtwork
            }
          }
        }
      }
    }
  `,
})
