import { ScreenOwnerType } from "@artsy/cohesion"
import { FullWidthIcon, GridIcon } from "@artsy/icons/native"
import { Screen, SimpleMessage, Text } from "@artsy/palette-mobile"
import { HomeViewSectionScreenArtworks_section$key } from "__generated__/HomeViewSectionScreenArtworks_section.graphql"
import { HomeViewSectionScreenQuery } from "__generated__/HomeViewSectionScreenQuery.graphql"
import { MasonryInfiniteScrollArtworkGrid } from "app/Components/ArtworkGrids/MasonryInfiniteScrollArtworkGrid"
import { PAGE_SIZE } from "app/Components/constants"
import { GlobalStore } from "app/store/GlobalStore"
import { goBack } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { NUM_COLUMNS_MASONRY } from "app/utils/masonryHelpers"
import { pluralize } from "app/utils/pluralize"
import { useRefreshControl } from "app/utils/refreshHelpers"
import { MotiPressable } from "moti/interactions"
import { graphql, usePaginationFragment } from "react-relay"

const ICON_SIZE = 26

interface ArtworksScreenHomeSection {
  section: HomeViewSectionScreenArtworks_section$key
}

export const HomeViewSectionScreenArtworks: React.FC<ArtworksScreenHomeSection> = (props) => {
  const defaultViewOption = GlobalStore.useAppState((state) => state.userPrefs.defaultViewOption)
  const setDefaultViewOption = GlobalStore.actions.userPrefs.setDefaultViewOption

  const {
    data: section,
    isLoadingNext,
    loadNext,
    refetch,
    hasNext,
  } = usePaginationFragment<HomeViewSectionScreenQuery, HomeViewSectionScreenArtworks_section$key>(
    artworksFragment,
    props.section
  )

  const artworks = extractNodes(section?.artworksConnection)

  const RefreshControl = useRefreshControl(refetch)

  const { scrollHandler } = Screen.useListenForScreenScroll()

  const numOfColumns = defaultViewOption === "grid" ? NUM_COLUMNS_MASONRY : 1

  return (
    <>
      <Screen.AnimatedHeader
        onBack={goBack}
        title={section.component?.title || ""}
        rightElements={
          <MotiPressable
            onPress={() => {
              setDefaultViewOption(defaultViewOption === "list" ? "grid" : "list")
            }}
            style={{ top: 5 }}
          >
            {defaultViewOption === "grid" ? (
              <FullWidthIcon height={ICON_SIZE} width={ICON_SIZE} />
            ) : (
              <GridIcon height={ICON_SIZE} width={ICON_SIZE} />
            )}
          </MotiPressable>
        }
      />

      <Screen.StickySubHeader
        title={section.component?.title || ""}
        Component={
          <Text variant="xs" mt={1}>
            {section.artworksConnection?.totalCount} {pluralize("Artwork", artworks.length)}
          </Text>
        }
      />

      <Screen.Body fullwidth>
        <MasonryInfiniteScrollArtworkGrid
          animated
          artworks={artworks}
          numColumns={numOfColumns}
          disableAutoLayout
          pageSize={PAGE_SIZE}
          ListEmptyComponent={
            <SimpleMessage m={2}>Nothing yet. Please check back later.</SimpleMessage>
          }
          refreshControl={RefreshControl}
          hasMore={hasNext}
          loadMore={() => {
            loadNext(PAGE_SIZE)
          }}
          isLoading={isLoadingNext}
          onScroll={scrollHandler}
          style={{ paddingBottom: 120 }}
          contextScreenOwnerType={section.ownerType as ScreenOwnerType}
        />
      </Screen.Body>
    </>
  )
}

export const artworksFragment = graphql`
  fragment HomeViewSectionScreenArtworks_section on HomeViewSectionArtworks
  @refetchable(queryName: "ArtworksScreenHomeSection_viewerRefetch")
  @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String" }) {
    internalID
    component {
      title
    }
    ownerType
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
