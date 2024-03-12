import { OwnerType } from "@artsy/cohesion"
import { Screen, SimpleMessage } from "@artsy/palette-mobile"
import { NewWorksFromGalleriesYouFollowQuery } from "__generated__/NewWorksFromGalleriesYouFollowQuery.graphql"
import { NewWorksFromGalleriesYouFollow_artworksConnection$key } from "__generated__/NewWorksFromGalleriesYouFollow_artworksConnection.graphql"
import { MasonryInfiniteScrollArtworkGrid } from "app/Components/ArtworkGrids/MasonryInfiniteScrollArtworkGrid"
import { PAGE_SIZE } from "app/Components/constants"
import { NewWorksFromGalleriesYouFollowPlaceholder } from "app/Scenes/NewWorksFromGalleriesYouFollow/Components/NewWorksFromGalleriesYouFollowPlaceholder"
import { extractNodes } from "app/utils/extractNodes"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { useViewOptionNumColumns } from "app/utils/masonryHelpers/viewOptionHelpers"
import { useRefreshControl } from "app/utils/refreshHelpers"
import { useLayoutEffect, useRef, useState } from "react"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"

export const NewWorksFromGalleriesYouFollow: React.FC = () => {
  const queryData = useLazyLoadQuery<NewWorksFromGalleriesYouFollowQuery>(
    NewWorksFromGalleriesYouFollowScreenQuery,
    newWorksFromGalleriesYouFollowQueryVariables
  )

  const { scrollHandler } = Screen.useListenForScreenScroll()

  const { data, loadNext, hasNext, isLoadingNext, refetch } = usePaginationFragment<
    NewWorksFromGalleriesYouFollowQuery,
    NewWorksFromGalleriesYouFollow_artworksConnection$key
  >(artworkConnectionFragment, queryData.me)

  const numColumns = useViewOptionNumColumns()

  const artworks = extractNodes(data?.newWorksFromGalleriesYouFollowConnection)

  const [hasChangedLayout, setHasChangedLayout] = useState(false)

  const firstUpdate = useRef(true)

  // This is a hack to force the grid to re-render when the layout changes
  // Flashlist makes a werid animation when changing between numColumns
  // We avoid it by showing the placeholder for a second while it's happening
  useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false
      return
    }

    setHasChangedLayout(true)
  }, [numColumns])

  const RefreshControl = useRefreshControl(refetch)

  if (hasChangedLayout) {
    setTimeout(() => {
      setHasChangedLayout(false)
    }, 1000)

    return <NewWorksFromGalleriesYouFollowPlaceholder />
  }

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
      numColumns={numColumns}
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
