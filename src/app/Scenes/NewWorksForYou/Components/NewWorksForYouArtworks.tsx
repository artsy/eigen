import { ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex, Screen, SimpleMessage, Text } from "@artsy/palette-mobile"
import { NewWorksForYouArtworksQuery } from "__generated__/NewWorksForYouArtworksQuery.graphql"
import { NewWorksForYouArtworks_viewer$key } from "__generated__/NewWorksForYouArtworks_viewer.graphql"
import { MasonryInfiniteScrollArtworkGrid } from "app/Components/ArtworkGrids/MasonryInfiniteScrollArtworkGrid"
import { NewWorksForYouPlaceholder } from "app/Scenes/NewWorksForYou/NewWorksForYou"
import { GlobalStore } from "app/store/GlobalStore"
import { extractNodes } from "app/utils/extractNodes"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { NUM_COLUMNS_MASONRY } from "app/utils/masonryHelpers"
import { pluralize } from "app/utils/pluralize"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"

export const PAGE_SIZE = 100

interface NewWorksForYouProps {
  viewer: NewWorksForYouArtworks_viewer$key
}

export const NewWorksForYouArtworks: React.FC<NewWorksForYouProps> = ({ viewer }) => {
  const defaultViewOption = GlobalStore.useAppState((state) => state.userPrefs.defaultViewOption)

  const { data } = usePaginationFragment(newWorksForYouArtworksFragment, viewer)
  const { scrollHandler } = Screen.useListenForScreenScroll()

  const artworks = extractNodes(data.artworks)
  const numColumns = defaultViewOption === "grid" ? NUM_COLUMNS_MASONRY : 1

  return (
    <Flex style={{ height: "100%" }}>
      <MasonryInfiniteScrollArtworkGrid
        animated
        artworks={artworks}
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
          <Text variant="xs" pt={2} px={2}>
            {artworks.length} {pluralize("Artwork", artworks.length)}
          </Text>
        )}
        hasMore={false}
        onScroll={scrollHandler}
        style={{ paddingBottom: 120 }}
      />
    </Flex>
  )
}

export const newWorksForYouArtworksFragment = graphql`
  fragment NewWorksForYouArtworks_viewer on Viewer
  @refetchable(queryName: "NewWorksForYouArtworks_viewerRefetch")
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 100 }
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
  query NewWorksForYouArtworksQuery(
    $version: String
    $maxWorksPerArtist: Int
    $onlyAtAuction: Boolean = false
  ) {
    viewer @principalField {
      ...NewWorksForYouArtworks_viewer
        @arguments(
          version: $version
          maxWorksPerArtist: $maxWorksPerArtist
          onlyAtAuction: $onlyAtAuction
        )
    }
  }
`

interface NewWorksForYouArtworksQRProps {
  maxWorksPerArtist?: number
  version?: string
  onlyAtAuction?: boolean
}

export const NewWorksForYouArtworksQR: React.FC<NewWorksForYouArtworksQRProps> = withSuspense(
  ({ version, onlyAtAuction = false, maxWorksPerArtist = 3 }) => {
    const data = useLazyLoadQuery<NewWorksForYouArtworksQuery>(
      newWorksForYouArtworksQuery,
      {
        version,
        maxWorksPerArtist,
        onlyAtAuction,
      },
      {
        fetchPolicy: "store-and-network",
      }
    )

    // This won't happen because the query would fail thanks to the @principalField
    // Adding it here to make TS happy
    if (!data.viewer) {
      return <Text>Something went wrong.</Text>
    }

    return <NewWorksForYouArtworks viewer={data.viewer} />
  },
  () => <NewWorksForYouPlaceholder defaultViewOption="grid" />
)
