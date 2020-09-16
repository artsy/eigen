import { SaleArtworksRail_saleArtworks } from "__generated__/SaleArtworksRail_saleArtworks.graphql"
import { AboveTheFoldFlatList } from "lib/Components/AboveTheFoldFlatList"
import { saleMessageOrBidInfo } from "lib/Components/ArtworkGrids/ArtworkGridItem"
import { ArtworkTileRailCard } from "lib/Components/ArtworkTileRail"
import { SectionTitle } from "lib/Components/SectionTitle"
import { Flex, Spacer } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface Props {
  saleArtworks: SaleArtworksRail_saleArtworks
}

export const SaleArtworksRail: React.FC<Props> = ({ saleArtworks }) => {
  return (
    <Flex mt={3}>
      <Flex mx={2}>
        <SectionTitle title="Lots by artists you follow" />
      </Flex>
      <AboveTheFoldFlatList
        horizontal
        ListHeaderComponent={() => <Spacer mr={2}></Spacer>}
        ListFooterComponent={() => <Spacer mr={2}></Spacer>}
        ItemSeparatorComponent={() => <Spacer width={15}></Spacer>}
        showsHorizontalScrollIndicator={false}
        data={saleArtworks}
        initialNumToRender={4}
        windowSize={3}
        renderItem={({ item: saleArtwork }) => (
          <ArtworkTileRailCard
            onPress={() => {
              // TODO: [MX-539] handle on press and add tracking
            }}
            imageURL={saleArtwork.artwork?.image?.url ?? ""}
            imageSize="small"
            useSquareAspectRatio
            artistNames={saleArtwork.artwork?.artistNames}
            saleMessage={saleMessageOrBidInfo({ artwork: saleArtwork.artwork!, isSmallTile: true })}
            lotLabel={saleArtwork.lotLabel}
          />
        )}
        keyExtractor={(item) => item.artwork!.internalID!}
      />
    </Flex>
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
      }
      lotLabel
    }
  `,
})
