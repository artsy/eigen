import { ContextModule, OwnerType } from "@artsy/cohesion"
import { Flex, Screen, SimpleMessage, Text } from "@artsy/palette-mobile"
import { HomeViewSectionScreenArtworksQuery } from "__generated__/HomeViewSectionScreenArtworksQuery.graphql"
import { HomeViewSectionScreenArtworks_artworksRailHomeViewSection$key } from "__generated__/HomeViewSectionScreenArtworks_artworksRailHomeViewSection.graphql"
import { MasonryInfiniteScrollArtworkGrid } from "app/Components/ArtworkGrids/MasonryInfiniteScrollArtworkGrid"
import { HomeViewSectionScreenArtworksPlaceholder } from "app/Scenes/HomeViewSectionScreen/Artworks/HomeViewSectionScreenArtworksPlaceholder"
import { GlobalStore } from "app/store/GlobalStore"
import { extractNodes } from "app/utils/extractNodes"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { NUM_COLUMNS_MASONRY } from "app/utils/masonryHelpers"
import { pluralize } from "app/utils/pluralize"
import { graphql, useLazyLoadQuery, usePaginationFragment } from "react-relay"

export const PAGE_SIZE = 100

interface ArtworksScreenHomeSection {
  section: HomeViewSectionScreenArtworks_artworksRailHomeViewSection$key
  title: string
}

export const ArtworksScreenHomeSection: React.FC<ArtworksScreenHomeSection> = ({
  section,
  title,
}) => {
  const defaultViewOption = GlobalStore.useAppState((state) => state.userPrefs.defaultViewOption)

  const { data } = usePaginationFragment(artworksFrogment, section)

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
          <Flex px={numColumns === 1 ? 2 : 0}>
            <Text variant="lg-display">{title}</Text>
            <Text variant="xs" pt={2}>
              {artworks.length} {pluralize("Artwork", artworks.length)}
            </Text>
          </Flex>
        )}
        hasMore={false}
        onScroll={scrollHandler}
        style={{ paddingBottom: 120 }}
      />
    </Flex>
  )
}

export const artworksFrogment = graphql`
  fragment HomeViewSectionScreenArtworks_artworksRailHomeViewSection on ArtworksRailHomeViewSection
  @refetchable(queryName: "ArtworksScreenHomeSection_viewerRefetch")
  @argumentDefinitions(count: { type: "Int", defaultValue: 100 }, cursor: { type: "String" }) {
    artworks: artworksConnection(after: $cursor, first: $count)
      @connection(key: "ArtworksScreenHomeSection_artworks", filters: []) {
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
      section(id: $id) {
        __typename
        ... on ArtworksRailHomeViewSection {
          component {
            title
          }
        }
        ...HomeViewSectionScreenArtworks_artworksRailHomeViewSection
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
      { id: props.sectionId },
      {
        // This is necessary to avoid displaying cached because this component is used in more than one place and Relay returns data from another screen before the new data is loaded.
        fetchPolicy: "network-only",
      }
    )

    // This won't happen because the query would fail thanks to the @principalField
    // Adding it here to make TS happy
    if (!data.homeView.section || !data.homeView.section.component?.title) {
      return <Text>Something went wrong.</Text>
    }

    return (
      <ArtworksScreenHomeSection
        section={data.homeView.section}
        title={data.homeView.section.component.title}
      />
    )
  }, HomeViewSectionScreenArtworksPlaceholder)
