import { BuyNowArtworksRail_sale } from "__generated__/BuyNowArtworksRail_sale.graphql"
import { ArtworkTileRailCard } from "lib/Components/ArtworkTileRail"
import { SectionTitle } from "lib/Components/SectionTitle"
import { navigate } from "lib/navigation/navigate"
import { extractNodes } from "lib/utils/extractNodes"
import { Flex, Spacer } from "palette"
import React from "react"
import { FlatList } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface BuyNowArtworksRailProps {
  sale: BuyNowArtworksRail_sale
}

export const BuyNowArtworksRail: React.FC<BuyNowArtworksRailProps> = ({ sale }) => {
  const artworks = extractNodes(sale?.promotedSale?.saleArtworksConnection)

  if (!artworks?.length) {
    return null
  }

  return (
    <Flex mt={3}>
      <Flex mx={2}>
        <SectionTitle title="Buy now" />
      </Flex>
      <FlatList
        horizontal
        ListHeaderComponent={() => <Spacer mr={2} />}
        ListFooterComponent={() => <Spacer mr={2} />}
        ItemSeparatorComponent={() => <Spacer width={15} />}
        showsHorizontalScrollIndicator={false}
        data={artworks}
        initialNumToRender={5}
        windowSize={3}
        renderItem={({ item: { artwork } }) => (
          <ArtworkTileRailCard
            onPress={() => {
              navigate(artwork?.href!)
            }}
            imageURL={artwork?.image?.imageURL}
            artistNames={artwork?.artistNames}
            saleMessage={artwork?.saleMessage}
            title={artwork?.title}
            date={artwork?.date}
            partner={artwork?.partner}
            useSquareAspectRatio
            imageSize="small"
          />
        )}
        keyExtractor={({ artwork }, index) => String(artwork?.id ?? index)}
      />
    </Flex>
  )
}

export const BuyNowArtworksRailContainer = createFragmentContainer(BuyNowArtworksRail, {
  sale: graphql`
    fragment BuyNowArtworksRail_sale on Sale @argumentDefinitions(id: { type: "ID" }) {
      promotedSale {
        saleArtworksConnection(first: 10) {
          edges {
            node {
              artwork {
                id
                title
                date
                saleMessage
                artistNames
                image {
                  imageURL
                }
                partner {
                  name
                }
                href
              }
            }
          }
        }
      }
    }
  `,
})
