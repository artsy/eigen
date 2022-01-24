import { BuyNowArtworksRail_sale } from "__generated__/BuyNowArtworksRail_sale.graphql"
import { ArtworkTileRailCard } from "lib/Components/ArtworkTileRail"
import { SectionTitle } from "lib/Components/SectionTitle"
import { navigate } from "lib/navigation/navigate"
import { extractNodes } from "lib/utils/extractNodes"
import { Flex, Spacer } from "palette"
import React, { useState } from "react"
import { FlatList } from "react-native"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"

export const INITIAL_NUMBER_TO_RENDER = 4
const PAGE_SIZE = 4

interface BuyNowArtworksRailProps {
  sale: BuyNowArtworksRail_sale
  relay: RelayPaginationProp
}

export const BuyNowArtworksRail: React.FC<BuyNowArtworksRailProps> = ({ sale, relay }) => {
  const artworks = extractNodes(sale?.promotedSale?.saleArtworksConnection)

  const [fetchingMore, setFetchingMore] = useState(false)

  const handleLoadMore = () => {
    if (!relay.hasMore() || fetchingMore) {
      return
    }
    setFetchingMore(true)
    relay.loadMore(PAGE_SIZE, (error) => {
      if (error) {
        console.error("BuyNowArtworksRail.tsx", error.message)
      }
      setFetchingMore(false)
    })
  }

  if (!artworks?.length) {
    return null
  }

  return (
    <Flex mt={3} testID="bnmo-rail-wrapper">
      <Flex mx={2}>
        <SectionTitle title="Artworks Available to Buy Now" />
      </Flex>
      <FlatList
        horizontal
        ListHeaderComponent={() => <Spacer mr={2} />}
        ListFooterComponent={() => <Spacer mr={2} />}
        ItemSeparatorComponent={() => <Spacer width={15} />}
        showsHorizontalScrollIndicator={false}
        data={artworks}
        initialNumToRender={INITIAL_NUMBER_TO_RENDER}
        windowSize={3}
        onEndReached={handleLoadMore}
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

export const BuyNowArtworksRailContainer = createPaginationContainer(
  BuyNowArtworksRail,
  {
    sale: graphql`
      fragment BuyNowArtworksRail_sale on Sale
      @argumentDefinitions(count: { type: "Int", defaultValue: 4 }, cursor: { type: "String" }) {
        internalID
        promotedSale {
          saleArtworksConnection(first: $count, after: $cursor)
            @connection(key: "Sale_saleArtworksConnection") {
            edges {
              node {
                artwork {
                  id
                  title
                  date
                  saleMessage
                  artistNames
                  href
                  image {
                    imageURL
                  }
                  partner {
                    name
                  }
                }
              }
            }
          }
        }
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props.sale.promotedSale?.saleArtworksConnection
    },
    getVariables(props, { count, cursor }) {
      return {
        id: props.sale.internalID,
        count,
        cursor,
      }
    },
    query: graphql`
      query BuyNowArtworksRailQuery($id: String!, $cursor: String, $count: Int!) {
        sale(id: $id) {
          ...BuyNowArtworksRail_sale @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)
