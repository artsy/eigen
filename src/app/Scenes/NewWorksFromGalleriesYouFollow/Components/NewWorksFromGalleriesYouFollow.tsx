import { OwnerType } from "@artsy/cohesion"
import { Screen, SimpleMessage } from "@artsy/palette-mobile"
import { NewWorksFromGalleriesYouFollowQuery } from "__generated__/NewWorksFromGalleriesYouFollowQuery.graphql"
import { NewWorksFromGalleriesYouFollow_artworksConnection$key } from "__generated__/NewWorksFromGalleriesYouFollow_artworksConnection.graphql"
import { MasonryInfiniteScrollArtworkGrid } from "app/Components/ArtworkGrids/MasonryInfiniteScrollArtworkGrid"
import { PAGE_SIZE } from "app/Components/constants"
import { NewWorksFromGalleriesYouFollowPlaceholder } from "app/Scenes/NewWorksFromGalleriesYouFollow/Components/NewWorksFromGalleriesYouFollowPlaceholder"
import { GlobalStore } from "app/store/GlobalStore"
import { extractNodes } from "app/utils/extractNodes"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { NUM_COLUMNS_MASONRY } from "app/utils/masonryHelpers"
import { useRefreshControl } from "app/utils/refreshHelpers"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"

export const NewWorksFromGalleriesYouFollow: React.FC = () => {
  const queryData = useLazyLoadQuery<NewWorksFromGalleriesYouFollowQuery>(
    NewWorksFromGalleriesYouFollowScreenQuery,
    newWorksFromGalleriesYouFollowQueryVariables
  )

  const defaultViewOption = GlobalStore.useAppState((state) => state.userPrefs.defaultViewOption)
  const { scrollHandler } = Screen.useListenForScreenScroll()

  const { data, loadNext, hasNext, isLoadingNext, refetch } = usePaginationFragment<
    NewWorksFromGalleriesYouFollowQuery,
    NewWorksFromGalleriesYouFollow_artworksConnection$key
  >(artworkConnectionFragment, queryData.me)

  const artworks = extractNodes(data?.newWorksFromGalleriesYouFollowConnection)
  const RefreshControl = useRefreshControl(refetch)
  const hasArtworks = artworks.length > 0
  const numOfColumns = defaultViewOption === "grid" ? NUM_COLUMNS_MASONRY : 1

  return (
    <MasonryInfiniteScrollArtworkGrid
      animated
      artworks={artworks}
      contextScreenOwnerType={OwnerType.newWorksFromGalleriesYouFollow}
      contextScreen={OwnerType.newWorksFromGalleriesYouFollow}
      ListEmptyComponent={
        <SimpleMessage m={2}>Nothing yet. Please check back later.</SimpleMessage>
      }
      refreshControl={RefreshControl}
      hasMore={hasNext}
      loadMore={() => loadNext(PAGE_SIZE)}
      isLoading={isLoadingNext}
      onScroll={scrollHandler}
      // WARNING: if the masonry is empty we need to have numColumns=1 to avoid a crash
      // that happens only when we dynamically change the number of columns see more here:
      // https://github.com/artsy/eigen/pull/10319
      numColumns={hasArtworks ? numOfColumns : 1}
    />
  )
}

export const NewWorksFromGalleriesYouFollowScreenQuery = graphql`
  query NewWorksFromGalleriesYouFollowQuery($count: Int, $after: String) {
    me {
      ...NewWorksFromGalleriesYouFollow_artworksConnection @arguments(count: $count, after: $after)
    }
  }
`

export const newWorksFromGalleriesYouFollowQueryVariables = {
  count: PAGE_SIZE,
}

const artworkConnectionFragment = graphql`
  fragment NewWorksFromGalleriesYouFollow_artworksConnection on Me
  @refetchable(queryName: "NewWorksFromGalleriesYouFollow_artworksConnectionRefetch")
  @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, after: { type: "String" }) {
    newWorksFromGalleriesYouFollowConnection(first: $count, after: $after)
      @connection(key: "NewWorksFromGalleriesYouFollow_newWorksFromGalleriesYouFollowConnection")
      @principalField {
      edges {
        cursor
        node {
          id
          slug
          image(includeAll: false) {
            aspectRatio
            blurhash
          }
          ...ArtworkGridItem_artwork @arguments(includeAllImages: false)
        }
      }
    }
  }
`

export const NewWorksFromGalleriesYouFollowQR: React.FC = withSuspense(() => {
  return <NewWorksFromGalleriesYouFollow />
}, NewWorksFromGalleriesYouFollowPlaceholder)
