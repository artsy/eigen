import { ContextModule, ScreenOwnerType } from "@artsy/cohesion"
import { Flex, Screen, SimpleMessage, Text } from "@artsy/palette-mobile"
import { HomeViewSectionScreenArtworksQuery } from "__generated__/HomeViewSectionScreenArtworksQuery.graphql"
import { HomeViewSectionScreenArtworks_artworksRailHomeViewSection$key } from "__generated__/HomeViewSectionScreenArtworks_artworksRailHomeViewSection.graphql"
import { MasonryInfiniteScrollArtworkGrid } from "app/Components/ArtworkGrids/MasonryInfiniteScrollArtworkGrid"
import { PAGE_SIZE } from "app/Components/constants"
import { HomeViewSectionScreenArtworksPlaceholder } from "app/Scenes/HomeViewSectionScreenArtworks/HomeViewSectionScreenArtworksPlaceholder"
import { goBack } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { NUM_COLUMNS_MASONRY } from "app/utils/masonryHelpers"
import { pluralize } from "app/utils/pluralize"
import { useRefreshControl } from "app/utils/refreshHelpers"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"

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
    <>
      <Screen.AnimatedHeader onBack={goBack} title={data.component?.title || ""} />

      <Screen.Body fullwidth>
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
      </Screen.Body>
    </>
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
interface ArtworksScreenHomeSectionQRProps {
  sectionID: string
}

export const HomeViewSectionScreenArtworksQueryRenderer: React.FC<ArtworksScreenHomeSectionQRProps> =
  withSuspense((props) => {
    const data = useLazyLoadQuery<HomeViewSectionScreenArtworksQuery>(artworksQuery, {
      id: props.sectionID,
    })

    // This won't happen because the query would fail thanks to the @principalField
    // Adding it here to make TS happy
    if (!data.homeView.section) {
      return <Text>Something went wrong.</Text>
    }

    return (
      <Screen>
        <HomeViewSectionScreenArtworks section={data.homeView.section} />
      </Screen>
    )
  }, HomeViewSectionScreenArtworksPlaceholder)
