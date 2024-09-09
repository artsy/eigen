import { ContextModule, ScreenOwnerType } from "@artsy/cohesion"
import { Flex, Screen, SimpleMessage, Text } from "@artsy/palette-mobile"
import { HomeViewSectionScreenArtworksQuery } from "__generated__/HomeViewSectionScreenArtworksQuery.graphql"
import { HomeViewSectionScreenArtworks_artworksRailHomeViewSection$key } from "__generated__/HomeViewSectionScreenArtworks_artworksRailHomeViewSection.graphql"
import { MasonryInfiniteScrollArtworkGrid } from "app/Components/ArtworkGrids/MasonryInfiniteScrollArtworkGrid"
import { PAGE_SIZE } from "app/Components/constants"
import { extractNodes } from "app/utils/extractNodes"
import { NUM_COLUMNS_MASONRY } from "app/utils/masonryHelpers"
import { pluralize } from "app/utils/pluralize"
import { useRefreshControl } from "app/utils/refreshHelpers"
import { graphql, usePaginationFragment } from "react-relay"

interface ArtworksScreenHomeSection {
  section: HomeViewSectionScreenArtworks_artworksRailHomeViewSection$key
}

export const HomeViewSectionScreenArtworks: React.FC<ArtworksScreenHomeSection> = (props) => {
  const { data, isLoadingNext, loadNext, refetch, hasNext } = usePaginationFragment<
    HomeViewSectionScreenArtworksQuery,
    HomeViewSectionScreenArtworks_artworksRailHomeViewSection$key
  >(artworksFragment, props.section)

  const artworks = extractNodes(data?.artworksConnection)

  const RefreshControl = useRefreshControl(refetch)

  const { scrollHandler } = Screen.useListenForScreenScroll()

  return (
    <MasonryInfiniteScrollArtworkGrid
      animated
      artworks={artworks}
      numColumns={NUM_COLUMNS_MASONRY}
      disableAutoLayout
      pageSize={PAGE_SIZE}
      ListEmptyComponent={
        <SimpleMessage m={2}>Nothing yet. Please check back later.</SimpleMessage>
      }
      ListHeaderComponent={() => (
        <Flex>
          <Text variant="lg-display">{data.component?.title}</Text>
          <Text variant="xs" pt={2}>
            {data.artworksConnection?.totalCount} {pluralize("Artwork", artworks.length)}
          </Text>
        </Flex>
      )}
      refreshControl={RefreshControl}
      hasMore={hasNext}
      loadMore={() => {
        loadNext(PAGE_SIZE)
      }}
      isLoading={isLoadingNext}
      onScroll={scrollHandler}
      style={{ paddingBottom: 120 }}
      contextModule={data.internalID as ContextModule}
      contextScreenOwnerType={data.internalID as ScreenOwnerType}
    />
  )
}

export const artworksFragment = graphql`
  fragment HomeViewSectionScreenArtworks_artworksRailHomeViewSection on ArtworksRailHomeViewSection
  @refetchable(queryName: "ArtworksScreenHomeSection_viewerRefetch")
  @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String" }) {
    internalID
    component {
      title
    }
    artworksConnection(after: $cursor, first: $count)
      @connection(key: "ArtworksScreenHomeSection_artworksConnection", filters: []) {
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

export const artworksQuery = graphql`
  query HomeViewSectionScreenArtworksQuery($id: String!) {
    homeView {
      section(id: $id) @principalField {
        ...HomeViewSectionScreenArtworks_artworksRailHomeViewSection
      }
    }
  }
`
