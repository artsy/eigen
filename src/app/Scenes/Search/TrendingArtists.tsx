import { ActionType, ContextModule, OwnerType, TappedArtistGroup } from "@artsy/cohesion"
import { Spacer, Flex, Box, BoxProps, Spinner } from "@artsy/palette-mobile"
import { SearchQuery } from "__generated__/SearchQuery.graphql"
import { TrendingArtists_query$key } from "__generated__/TrendingArtists_query.graphql"
import { ArtistCardContainer as ArtistCard } from "app/Components/Home/ArtistRails/ArtistCard"
import { CardRailFlatList } from "app/Components/Home/CardRailFlatList"
import { SectionTitle } from "app/Components/SectionTitle"
import { useNavigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { isTablet } from "react-native-device-info"
import { usePaginationFragment, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import { TrendingArtistCard } from "./components/TrendingArtistCard"

const MAX_TRENDING_ARTTISTS_PER_RAIL = 20

interface TrendingArtistsProps extends BoxProps {
  data: TrendingArtists_query$key
}

export const TrendingArtists: React.FC<TrendingArtistsProps> = ({ data, ...boxProps }) => {
  const tracking = useTracking()
  const useLargeSizeCard = isTablet()
  const {
    data: result,
    hasNext,
    isLoadingNext,
    loadNext,
  } = usePaginationFragment<SearchQuery, TrendingArtists_query$key>(trendingArtistsFragment, data)
  const nodes = extractNodes(result.curatedTrendingArtists)

  const navigate = useNavigate()

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
        initialNumToRender={useLargeSizeCard ? 4 : 3}
        keyExtractor={(node) => node.internalID}
        onEndReached={loadMore}
        renderItem={({ item, index }) => {
          const onPress = () => {
            if (item.href) {
              navigate(item.href)
              tracking.trackEvent(tracks.tappedArtistGroup(item.internalID, item.slug, index))
            }
          }

          if (useLargeSizeCard) {
            return <ArtistCard artist={item} onPress={onPress} />
          }

          return <TrendingArtistCard artist={item} onPress={onPress} />
        }}
        ItemSeparatorComponent={() => <Spacer x={1} />}
        ListFooterComponent={!!hasNext ? <LoadingIndicator /> : <Spacer x={2} />}
      />
    </Box>
  )
}

const LoadingIndicator = () => {
  return (
    <Flex flex={1} flexDirection="row" alignItems="center" justifyContent="center" px={4}>
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
          slug
          ...ArtistCard_artist
          ...TrendingArtistCard_artist
        }
      }
    }
  }
`

const tracks = {
  tappedArtistGroup: (
    artistId: string,
    artistSlug: string,
    position: number
  ): TappedArtistGroup => ({
    action: ActionType.tappedArtistGroup,
    context_module: ContextModule.trendingArtistsRail,
    context_screen_owner_type: OwnerType.search,
    destination_screen_owner_type: OwnerType.artist,
    destination_screen_owner_slug: artistSlug,
    destination_screen_owner_id: artistId,
    horizontal_slide_position: position,
    type: "thumbnail",
  }),
}
