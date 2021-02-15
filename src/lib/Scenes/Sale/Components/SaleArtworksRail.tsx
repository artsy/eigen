import { OwnerType } from "@artsy/cohesion"
import { SaleArtworksRail_me } from "__generated__/SaleArtworksRail_me.graphql"
import { AboveTheFoldFlatList } from "lib/Components/AboveTheFoldFlatList"
import { SaleArtworkTileRailCardContainer } from "lib/Components/SaleArtworkTileRailCard"
import { SectionTitle } from "lib/Components/SectionTitle"
import { navigate } from "lib/navigation/navigate"
import { extractNodes } from "lib/utils/extractNodes"
import { Flex, Spacer } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  me: SaleArtworksRail_me
}

export const INITIAL_NUMBER_TO_RENDER = 4

export const SaleArtworksRail: React.FC<Props> = ({ me }) => {
  const artworks = extractNodes(me?.lotsByFollowedArtistsConnection)

  if (!artworks?.length) {
    return null
  }

  return (
    <Flex mt="3">
      <Flex mx="2" my="1">
        <SectionTitle title="Lots by artists you follow" />
      </Flex>
      <AboveTheFoldFlatList
        horizontal
        ListHeaderComponent={() => <Spacer mr="2"></Spacer>}
        ListFooterComponent={() => <Spacer mr="2"></Spacer>}
        ItemSeparatorComponent={() => <Spacer width={15}></Spacer>}
        showsHorizontalScrollIndicator={false}
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
      lotsByFollowedArtistsConnection(first: 10, includeArtworksByFollowedArtists: true, saleID: $saleID) {
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
