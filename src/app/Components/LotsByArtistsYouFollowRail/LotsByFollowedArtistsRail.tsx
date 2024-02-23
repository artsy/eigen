import { OwnerType } from "@artsy/cohesion"
import { Flex } from "@artsy/palette-mobile"
import { LotsByFollowedArtistsRail_me$data } from "__generated__/LotsByFollowedArtistsRail_me.graphql"
import { CardRailFlatList } from "app/Components/Home/CardRailFlatList"
import { SaleArtworkTileRailCardContainer } from "app/Components/SaleArtworkTileRailCard"
import { SectionTitle } from "app/Components/SectionTitle"
import { navigate } from "app/system/navigation/navigate"
import { useNavigateToPageableRoute } from "app/system/navigation/useNavigateToPageableRoute"
import { extractNodes } from "app/utils/extractNodes"
import { isCloseToEdge } from "app/utils/isCloseToEdge"
import { debounce } from "lodash"
import { memo, useState } from "react"
import { isTablet } from "react-native-device-info"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"

export const PAGE_SIZE = 6

interface Props {
  title: string
  me: LotsByFollowedArtistsRail_me$data
  relay: RelayPaginationProp
  cardSize?: "large" | "small"
}

export const LotsByFollowedArtistsRail: React.FC<Props> = ({
  title,
  me,
  relay,
  cardSize = "small",
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const artworks = extractNodes(me?.lotsByFollowedArtistsConnection)

  const { navigateToPageableRoute } = useNavigateToPageableRoute({ items: artworks })

  const hasSaleArtworks = artworks?.some((artwork) => artwork?.saleArtwork)

  if (!hasSaleArtworks) {
    return null
  }

  const fetchNextPage = () => {
    if (!relay.hasMore() || isLoading) {
      return
    }

    setIsLoading(true)

    relay.loadMore(PAGE_SIZE, (error) => {
      setIsLoading(false)

      if (error) {
        // FIXME: Handle error
        console.error("LotsByFollowedArtistsRail.tsx", error.message)
      }
    })
  }

  const refreshDebounce = debounce(
    () => {
      relay.refetchConnection(PAGE_SIZE)
    },
    // 10 secs, hopefully the timely_at on the lots in the backend has been updated
    10000
  )

  const doRefresh = () => {
    refreshDebounce()
  }

  return (
    <Flex>
      <Flex mx={2}>
        <SectionTitle
          title={title}
          onPress={() => navigate("/auctions/lots-for-you-ending-soon")}
        />
      </Flex>
      <CardRailFlatList
        data={artworks}
        initialNumToRender={isTablet() ? 10 : 5}
        windowSize={3}
        renderItem={({ item: artwork }) => {
          if (!artwork?.saleArtwork) {
            return null
          }

          return (
            <SaleArtworkTileRailCardContainer
              onPress={() => {
                navigateToPageableRoute(artwork.href || "")
              }}
              saleArtwork={artwork.saleArtwork}
              useSquareAspectRatio
              useCustomSaleMessage
              contextScreenOwnerType={OwnerType.sale}
              cardSize={cardSize}
              refreshRail={doRefresh}
            />
          )
        }}
        keyExtractor={(item) => item.id}
        onScroll={isCloseToEdge(fetchNextPage)}
      />
    </Flex>
  )
}

export const LotsByFollowedArtistsRailContainer = memo(
  createPaginationContainer(
    LotsByFollowedArtistsRail,
    {
      me: graphql`
        fragment LotsByFollowedArtistsRail_me on Me
        @argumentDefinitions(count: { type: "Int", defaultValue: 6 }, cursor: { type: "String" }) {
          lotsByFollowedArtistsConnection(
            first: $count
            after: $cursor
            includeArtworksByFollowedArtists: true
            excludeClosedLots: true
            sort: "timely_at"
            isAuction: true
            liveSale: true
          ) @connection(key: "LotsByFollowedArtistsRail_lotsByFollowedArtistsConnection") {
            pageInfo {
              hasNextPage
              startCursor
              endCursor
            }
            edges {
              node {
                id
                href
                slug
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
        query LotsByFollowedArtistsRailQuery($cursor: String, $count: Int!) {
          me {
            ...LotsByFollowedArtistsRail_me @arguments(cursor: $cursor, count: $count)
          }
        }
      `,
    }
  )
)
