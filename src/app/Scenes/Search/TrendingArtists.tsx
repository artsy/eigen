import { SearchQuery } from "__generated__/SearchQuery.graphql"
import { TrendingArtists_query$key } from "__generated__/TrendingArtists_query.graphql"
import { ArtistCardContainer as ArtistCard } from "app/Components/Home/ArtistRails/ArtistCard"
import { CardRailFlatList } from "app/Components/Home/CardRailFlatList"
import { navigate } from "app/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { Flex, Spacer, Spinner, Text } from "palette"
import { usePaginationFragment } from "react-relay"
import { graphql } from "relay-runtime"

const MAX_TRENDING_ARTTISTS = 20

interface TrendingArtistsProps {
  data: TrendingArtists_query$key
}

export const TrendingArtists: React.FC<TrendingArtistsProps> = ({ data }) => {
  const {
    data: result,
    hasNext,
    isLoadingNext,
    loadNext,
  } = usePaginationFragment<SearchQuery, TrendingArtists_query$key>(trendingArtistsFragment, data)
  const nodes = extractNodes(result.curatedTrendingArtists)

  const handleCardPress = (href: string) => {
    navigate(href)
  }

  const loadMore = () => {
    if (!hasNext || isLoadingNext || nodes.length >= MAX_TRENDING_ARTTISTS) {
      return
    }

    loadNext(5)
  }

  return (
    <>
      <Text variant="sm" mx={2}>
        Trending Artists
      </Text>
      <Spacer mb={2} />

      <CardRailFlatList
        data={nodes}
        keyExtractor={(node) => node.internalID}
        onEndReached={loadMore}
        renderItem={({ item }) => {
          return <ArtistCard artist={item} onPress={() => handleCardPress(item.href!)} />
        }}
        ItemSeparatorComponent={() => <Spacer ml={1} />}
        ListFooterComponent={
          <>
            {!!hasNext && (
              <Flex justifyContent="center" mx={3} height="200">
                <Spinner />
              </Flex>
            )}
            <Spacer mr={2} />
          </>
        }
      />
    </>
  )
}

const trendingArtistsFragment = graphql`
  fragment TrendingArtists_query on Query
  @refetchable(queryName: "TrendingArtists_queryRefetch")
  @argumentDefinitions(count: { type: "Int", defaultValue: 5 }, cursor: { type: "String" }) {
    curatedTrendingArtists(first: $count, after: $cursor)
      @connection(key: "TrendingArtists_curatedTrendingArtists") {
      edges {
        node {
          internalID
          href
          ...ArtistCard_artist
        }
      }
    }
  }
`
