import { ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex, Screen, SimpleMessage, Text } from "@artsy/palette-mobile"
import { WorksForYouArtworksQuery } from "__generated__/WorksForYouArtworksQuery.graphql"
import { WorksForYouArtworks_viewer$key } from "__generated__/WorksForYouArtworks_viewer.graphql"
import { MasonryInfiniteScrollArtworkGrid } from "app/Components/ArtworkGrids/MasonryInfiniteScrollArtworkGrid"
import { SCROLLVIEW_PADDING_BOTTOM_OFFSET } from "app/Components/constants"
import { NewWorksForYouPlaceholder } from "app/Scenes/NewWorksForYou/NewWorksForYou"
import { GlobalStore } from "app/store/GlobalStore"
import { extractNodes } from "app/utils/extractNodes"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { NUM_COLUMNS_MASONRY } from "app/utils/masonryHelpers"
import { pluralize } from "app/utils/pluralize"
import { useRefreshControl } from "app/utils/refreshHelpers"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"

export const PAGE_SIZE = 20

interface NewWorksForYouProps {
  viewer: WorksForYouArtworks_viewer$key
}

export const WorksForYouArtworks: React.FC<NewWorksForYouProps> = ({ viewer }) => {
  const defaultViewOption = GlobalStore.useAppState((state) => state.userPrefs.defaultViewOption)

  const { data, loadNext, hasNext, isLoadingNext, refetch } = usePaginationFragment(
    newWorksForYouArtworksFragment,
    viewer
  )

  const { scrollHandler } = Screen.useListenForScreenScroll()

  const RefreshControl = useRefreshControl(refetch)

  const artworks = extractNodes(data.artworks)
  const numColumns = defaultViewOption === "grid" ? NUM_COLUMNS_MASONRY : 1

  return (
    <Flex style={{ height: "100%" }}>
      <MasonryInfiniteScrollArtworkGrid
        animated
        artworks={artworks}
        isLoading={isLoadingNext}
        loadMore={loadNext}
        hasMore={hasNext}
        numColumns={numColumns}
        disableAutoLayout
        pageSize={PAGE_SIZE}
        contextModule={ContextModule.newWorksForYouRail}
        contextScreenOwnerType={OwnerType.newWorksForYou}
        contextScreen={OwnerType.newWorksForYou}
        ListEmptyComponent={
          <SimpleMessage m={2}>Nothing yet. Please check back later.</SimpleMessage>
        }
        ListHeaderComponent={() => (
          <Text variant="xs" pt={2} px={numColumns === 1 ? 2 : 0}>
            {artworks.length} {pluralize("Artwork", data.artworks?.totalCount ?? 0)}
          </Text>
        )}
        onScroll={scrollHandler}
        refreshControl={RefreshControl}
        style={{ paddingBottom: SCROLLVIEW_PADDING_BOTTOM_OFFSET }}
      />
    </Flex>
  )
}

export const newWorksForYouArtworksFragment = graphql`
  fragment WorksForYouArtworks_viewer on Viewer
  @refetchable(queryName: "WorksForYouArtworks_viewerRefetch")
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 20 }
    cursor: { type: "String" }
    version: { type: "String" }
    maxWorksPerArtist: { type: "Int" }
    onlyAtAuction: { type: "Boolean" }
  ) {
    artworks: artworksForUser(
      after: $cursor
      first: $count
      includeBackfill: true
      maxWorksPerArtist: $maxWorksPerArtist
      version: $version
      onlyAtAuction: $onlyAtAuction
      excludeDislikedArtworks: true
    ) @connection(key: "NewWorksForYou_artworks", filters: []) {
      totalCount
      edges {
        node {
          id
          slug
          href
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

export const newWorksForYouArtworksQuery = graphql`
  query WorksForYouArtworksQuery(
    $version: String
    $maxWorksPerArtist: Int
    $onlyAtAuction: Boolean = false
  ) {
    viewer @principalField {
      ...WorksForYouArtworks_viewer
        @arguments(
          version: $version
          maxWorksPerArtist: $maxWorksPerArtist
          onlyAtAuction: $onlyAtAuction
        )
    }
  }
`

interface WorksForYouArtworksQRProps {
  maxWorksPerArtist?: number
  version?: string
  onlyAtAuction?: boolean
}

export const WorksForYouArtworksQR: React.FC<WorksForYouArtworksQRProps> = withSuspense({
  Component: ({ version, onlyAtAuction = false, maxWorksPerArtist = 3 }) => {
    const data = useLazyLoadQuery<WorksForYouArtworksQuery>(
      newWorksForYouArtworksQuery,
      {
        version,
        maxWorksPerArtist,
        onlyAtAuction,
      },
      {
        // This is necessary to avoid displaying cached because this component is used in more than one place and Relay returns data from another screen before the new data is loaded.
        fetchPolicy: "network-only",
      }
    )

    // This won't happen because the query would fail thanks to the @principalField
    // Adding it here to make TS happy
    if (!data.viewer) {
      return <Text>Something went wrong.</Text>
    }

    return <WorksForYouArtworks viewer={data.viewer} />
  },
  LoadingFallback: () => <NewWorksForYouPlaceholder />,
  ErrorFallback: () => <SimpleMessage m={2}>Nothing yet. Please check back later.</SimpleMessage>,
})
