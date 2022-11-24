import { SearchQuery } from "__generated__/SearchQuery.graphql"
import { TrendingArtists_query$key } from "__generated__/TrendingArtists_query.graphql"
import { ArtistCardContainer as ArtistCard } from "app/Components/Home/ArtistRails/ArtistCard"
import { CardRailFlatList } from "app/Components/Home/CardRailFlatList"
import { SectionTitle } from "app/Components/SectionTitle"
import { navigate } from "app/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { isPad } from "app/utils/hardware"
import { Box, BoxProps, Flex, Spacer, Spinner } from "palette"
import { usePaginationFragment } from "react-relay"
import { graphql } from "relay-runtime"
import { TrendingArtistCard } from "./components/TrendingArtistCard"

const MAX_TRENDING_ARTTISTS_PER_RAIL = 20

interface TrendingArtistsProps extends BoxProps {
  data: TrendingArtists_query$key
}

export const TrendingArtists: React.FC<TrendingArtistsProps> = ({ data, ...boxProps }) => {
  const useLargeSizeCard = isPad()
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
    if (!hasNext || isLoadingNext || nodes.length >= MAX_TRENDING_ARTTISTS_PER_RAIL) {
      return
    }

    loadNext(5)
  }

  if (nodes.length === 0) {
    return null
  }

  return (
    <Box {...boxProps}>
      <Box mx={2}>
        <SectionTitle title="Trending Artists" />
      </Box>

      <CardRailFlatList
        data={nodes}
        initialNumToRender={useLargeSizeCard ? 3 : 4}
        keyExtractor={(node) => node.internalID}
        onEndReached={loadMore}
        renderItem={({ item }) => {
          if (useLargeSizeCard) {
            return <ArtistCard artist={item} onPress={() => handleCardPress(item.href!)} />
          }

          return <TrendingArtistCard artist={item} />
        }}
        ItemSeparatorComponent={() => <Spacer ml={1} />}
        ListFooterComponent={!!hasNext ? <LoadingIndicator /> : null}
      />
    </Box>
  )
}

const LoadingIndicator = () => {
  return (
    <Flex flex={1} flexDirection="row" alignItems="center" justifyContent="center" px={3}>
      <Spinner />
    </Flex>
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
          ...TrendingArtistCard_artist
        }
      }
    }
  }
`
