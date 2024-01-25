import { OwnerType } from "@artsy/cohesion"
import { Screen, SimpleMessage } from "@artsy/palette-mobile"
import { RecentlyViewedArtworksQuery } from "__generated__/RecentlyViewedArtworksQuery.graphql"
import { RecentlyViewedArtworks_artworksConnection$key } from "__generated__/RecentlyViewedArtworks_artworksConnection.graphql"
import { MasonryInfiniteScrollArtworkGrid } from "app/Components/ArtworkGrids/MasonryInfiniteScrollArtworkGrid"
import { PAGE_SIZE } from "app/Components/constants"
import { RecentlyViewedPlaceholder } from "app/Scenes/RecentlyViewed/Components/RecentlyViewedPlaceholder"
import { ViewOption } from "app/Scenes/Search/UserPrefsModel"
import { extractNodes } from "app/utils/extractNodes"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { NUM_COLUMNS_MASONRY } from "app/utils/masonryHelpers"
import { useRefreshControl } from "app/utils/refreshHelpers"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"

interface RecentlyViewedArtworksProps {
  viewOption: ViewOption
}

export const RecentlyViewedArtworks: React.FC<RecentlyViewedArtworksProps> = ({ viewOption }) => {
  const queryData = useLazyLoadQuery<RecentlyViewedArtworksQuery>(
    RecentlyViewedScreenQuery,
    recentlyViewedArtworksQueryVariables
  )
  const { scrollHandler } = Screen.useListenForScreenScroll()

  const { data, loadNext, hasNext, isLoadingNext, refetch } = usePaginationFragment<
    RecentlyViewedArtworksQuery,
    RecentlyViewedArtworks_artworksConnection$key
  >(artworkConnectionFragment, queryData.me)

  const artworks = extractNodes(data?.recentlyViewedArtworksConnection)
  const RefreshControl = useRefreshControl(refetch)

  const numOfColumns = viewOption === "grid" ? NUM_COLUMNS_MASONRY : 1

  return (
    <MasonryInfiniteScrollArtworkGrid
      animated
      artworks={artworks}
      contextScreenOwnerType={OwnerType.recentlyViewed}
      contextScreen={OwnerType.recentlyViewed}
      ListEmptyComponent={
        <SimpleMessage m={2}>Nothing yet. Please check back later.</SimpleMessage>
      }
      refreshControl={RefreshControl}
      hasMore={hasNext}
      loadMore={(pageSize) => loadNext(pageSize)}
      isLoading={isLoadingNext}
      numColumns={numOfColumns}
      onScroll={scrollHandler}
    />
  )
}

export const recentlyViewedArtworksQueryVariables = {
  count: PAGE_SIZE,
}

export const RecentlyViewedScreenQuery = graphql`
  query RecentlyViewedArtworksQuery($count: Int, $after: String) {
    me {
      ...RecentlyViewedArtworks_artworksConnection @arguments(count: $count, after: $after)
    }
  }
`

const artworkConnectionFragment = graphql`
  fragment RecentlyViewedArtworks_artworksConnection on Me
  @refetchable(queryName: "RecentlyViewedArtworks_artworksConnectionRefetch")
  @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, after: { type: "String" }) {
    recentlyViewedArtworksConnection(first: $count, after: $after)
      @connection(key: "RecentlyViewed_recentlyViewedArtworksConnection")
      @principalField {
      edges {
        cursor
        node {
          id
          slug
          image(includeAll: false) {
            aspectRatio
          }
          ...ArtworkGridItem_artwork @arguments(includeAllImages: false)
        }
      }
    }
  }
`

export const RecentlyViewedArtworksQR: React.FC<RecentlyViewedArtworksProps> = withSuspense(
  (props) => {
    return <RecentlyViewedArtworks {...props} />
  },
  RecentlyViewedPlaceholder
)
