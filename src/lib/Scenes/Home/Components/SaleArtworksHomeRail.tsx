import { OwnerType } from "@artsy/cohesion"
import { SaleArtworksHomeRail_me } from "__generated__/SaleArtworksHomeRail_me.graphql"
import { CardRailFlatList } from "lib/Components/Home/CardRailFlatList"
import { SaleArtworkTileRailCardContainer } from "lib/Components/SaleArtworkTileRailCard"
import { SectionTitle } from "lib/Components/SectionTitle"
import { navigate } from "lib/navigation/navigate"
import { extractNodes } from "lib/utils/extractNodes"
import { isCloseToEdge } from "lib/utils/isCloseToEdge"
import { Flex } from "palette"
import React, { useState } from "react"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"

export const PAGE_SIZE = 6

interface Props {
  me: SaleArtworksHomeRail_me
  relay: RelayPaginationProp
}

export const SaleArtworksHomeRail: React.FC<Props> = ({ me, relay }) => {
  const artworks = extractNodes(me?.lotsByFollowedArtistsConnection)

  if (!artworks?.length) {
    return null
  }

  const [isLoading, setIsLoading] = useState(false)

  const fetchNextPage = () => {
    if (!relay.hasMore() || isLoading) {
      return
    }

    setIsLoading(true)

    relay.loadMore(PAGE_SIZE, (error) => {
      setIsLoading(false)

      if (error) {
        // FIXME: Handle error
        console.error("SaleArtworksHomeRail.tsx", error.message)
      }
    })
  }

  return (
    <Flex>
      <Flex mx={2}>
        <SectionTitle title="Auction lots for you ending soon" />
      </Flex>
      <CardRailFlatList
        data={artworks}
        initialNumToRender={PAGE_SIZE}
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
        onScroll={isCloseToEdge(fetchNextPage)}
      />
    </Flex>
  )
}

export const SaleArtworksHomeRailContainer = createPaginationContainer(
  SaleArtworksHomeRail,
  {
    me: graphql`
      fragment SaleArtworksHomeRail_me on Me
      @argumentDefinitions(count: { type: "Int", defaultValue: 6 }, cursor: { type: "String" }) {
        lotsByFollowedArtistsConnection(
          first: $count
          after: $cursor
          includeArtworksByFollowedArtists: true
          isAuction: true
          liveSale: true
        ) @connection(key: "SaleArtworksHomeRail_lotsByFollowedArtistsConnection") {
          pageInfo {
            hasNextPage
            startCursor
            endCursor
          }
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
  },
  {
    getConnectionFromProps(props) {
      return props?.me?.lotsByFollowedArtistsConnection
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      }
    },
    getVariables(_props, { count, cursor }, fragmentVariables) {
      return {
        ...fragmentVariables,
        cursor,
        count,
      }
    },
    query: graphql`
      query SaleArtworksHomeRailQuery($cursor: String, $count: Int!) {
        me {
          ...SaleArtworksHomeRail_me @arguments(cursor: $cursor, count: $count)
        }
      }
    `,
  }
)
