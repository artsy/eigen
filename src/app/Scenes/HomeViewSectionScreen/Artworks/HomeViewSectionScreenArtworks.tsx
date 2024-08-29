import { Flex, Screen, SimpleMessage, Text } from "@artsy/palette-mobile"
import { HomeViewSectionScreenArtworksQuery } from "__generated__/HomeViewSectionScreenArtworksQuery.graphql"
import { HomeViewSectionScreenArtworks_section$data } from "__generated__/HomeViewSectionScreenArtworks_section.graphql"
import { MasonryInfiniteScrollArtworkGrid } from "app/Components/ArtworkGrids/MasonryInfiniteScrollArtworkGrid"
import { PAGE_SIZE } from "app/Components/constants"
import { HomeViewSectionScreenArtworksPlaceholder } from "app/Scenes/HomeViewSectionScreen/Artworks/HomeViewSectionScreenArtworksPlaceholder"
import { extractNodes } from "app/utils/extractNodes"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { NUM_COLUMNS_MASONRY } from "app/utils/masonryHelpers"
import { pluralize } from "app/utils/pluralize"
import { useRefreshControl } from "app/utils/refreshHelpers"
import {
  createPaginationContainer,
  graphql,
  RelayPaginationProp,
  useLazyLoadQuery,
} from "react-relay"

interface ArtworksScreenHomeSection {
  section: HomeViewSectionScreenArtworks_section$data
  relay: RelayPaginationProp
}

export const ArtworksScreenHomeSection: React.FC<ArtworksScreenHomeSection> = ({
  section,
  relay,
}) => {
  const { scrollHandler } = Screen.useListenForScreenScroll()

  const artworks = extractNodes(section?.artworksConnection)

  const RefreshControl = useRefreshControl(relay.refetch)

  const isLoading = relay.isLoading()
  const hasNext = relay.hasMore()
  const loadMore = relay.loadMore

  return (
    <Flex style={{ height: "100%" }}>
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
            <Text variant="lg-display">{section.component?.title}</Text>
            <Text variant="xs" pt={2}>
              {section.artworksConnection?.totalCount} {pluralize("Artwork", artworks.length)}
            </Text>
          </Flex>
        )}
        refreshControl={RefreshControl}
        hasMore={hasNext}
        loadMore={() => {
          loadMore(PAGE_SIZE, (error) => {
            console.error("Failed to load more", error)
          })
        }}
        isLoading={isLoading}
        onScroll={scrollHandler}
        style={{ paddingBottom: 120 }}
      />
    </Flex>
  )
}

export const ArtworksListPaginationContainer = createPaginationContainer(
  ArtworksScreenHomeSection,
  {
    section: graphql`
      fragment HomeViewSectionScreenArtworks_section on ArtworksRailHomeViewSection
      @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String" }) {
        id
        internalID
        component {
          title
        }
        artworksConnection(after: $cursor, first: $count)
          @connection(key: "HomeViewSectionScreenArtworks_artworksConnection") {
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
    `,
  },
  {
    getVariables(_props, { count, cursor }, fragmentVariables) {
      return {
        ...fragmentVariables,
        id: _props.section.internalID,
        cursor,
        count,
      }
    },
    query: graphql`
      query HomeViewSectionScreenArtworksListQuery($cursor: String, $count: Int!, $id: String!) {
        homeView {
          section(id: $id) {
            ...HomeViewSectionScreenArtworks_section @arguments(cursor: $cursor, count: $count)
          }
        }
      }
    `,
  }
)

export const artworksQuery = graphql`
  query HomeViewSectionScreenArtworksQuery($id: String!) {
    homeView {
      section(id: $id) @principalField {
        ...HomeViewSectionScreenArtworks_section
      }
    }
  }
`

interface ArtworksScreenHomeSectionQRProps {
  sectionId: string
}

export const HomeViewSectionScreenArtworksQueryRenderer: React.FC<ArtworksScreenHomeSectionQRProps> =
  withSuspense((props) => {
    const data = useLazyLoadQuery<HomeViewSectionScreenArtworksQuery>(
      artworksQuery,
      {
        id: props.sectionId,
      },
      {
        fetchPolicy: "network-only",
      }
    )

    // This won't happen because the query would fail thanks to the @principalField
    // Adding it here to make TS happy
    if (!data.homeView.section) {
      return <Text>Something went wrong.</Text>
    }

    return <ArtworksListPaginationContainer section={data.homeView.section} />
  }, HomeViewSectionScreenArtworksPlaceholder)
