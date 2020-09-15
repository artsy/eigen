// import { SaleArtwork_saleArtwork } from "__generated__/SaleArtwork_saleArtwork.graphql"
import { SaleArtworksRail_saleArtworks } from "__generated__/SaleArtworksRail_saleArtworks.graphql"
import { AboveTheFoldFlatList } from "lib/Components/AboveTheFoldFlatList"
import { saleMessageOrBidInfo } from "lib/Components/ArtworkGrids/ArtworkGridItem"
import { ArtworkTileRailCard } from "lib/Components/ArtworkTileRail"
import { SectionTitle } from "lib/Components/SectionTitle"
import { Flex, Spacer } from "palette"
import React from "react"
import { View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  saleArtworks: SaleArtworksRail_saleArtworks
}

export const SaleArtworksRail: React.FC<Props> = ({ saleArtworks }) => {
  const artworks = saleArtworks.map((saleArtwork: SaleArtworksRail_saleArtworks[0]) => saleArtwork.artwork)
  return (
    <View>
      <Flex mx="2">
        <SectionTitle title="Lots by artists you follow" />
      </Flex>
      <AboveTheFoldFlatList
        horizontal
        ListHeaderComponent={() => <Spacer mr={2}></Spacer>}
        ListFooterComponent={() => <Spacer mr={2}></Spacer>}
        ItemSeparatorComponent={() => <Spacer width={15}></Spacer>}
        showsHorizontalScrollIndicator={false}
        data={artworks}
        initialNumToRender={4}
        windowSize={3}
        renderItem={({ item: artwork }) => (
          <ArtworkTileRailCard
            onPress={() => {
              console.log("Navigate to Lot")
            }}
            imageURL={artwork?.image?.url ?? ""}
            imageSize="small"
            useSquareAspectRatio
            artistNames={artwork?.artistNames}
            // @ts-ignore STRICTNESS_MIGRATION
            saleMessage={saleMessageOrBidInfo({ artwork, isSmallTile: true })}
            showLotNumber
          />
        )}
        keyExtractor={(item) => item!.internalID!}
      />
    </View>
  )
}

export const SaleArtworksRailContainer = createFragmentContainer(SaleArtworksRail, {
  saleArtworks: graphql`
    fragment SaleArtworksRail_saleArtworks on SaleArtwork @relay(plural: true) {
      artwork {
        image {
          url(version: "small")
        }
        href
        saleMessage
        artistNames
        slug
        internalID
        sale {
          isAuction
          isClosed
          displayTimelyAt
          endAt
        }
        saleMessage
        saleArtwork {
          counts {
            bidderPositions
          }
          currentBid {
            display
          }
        }
        partner {
          name
        }
        image {
          imageURL
        }
      }
      lotLabel
    }
  `,
})
