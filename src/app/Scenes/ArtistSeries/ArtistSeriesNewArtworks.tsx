import { Box, Flex, Spinner, Tabs, useScreenDimensions, useSpace } from "@artsy/palette-mobile"
import { MasonryFlashListRef } from "@shopify/flash-list"
import { ArtistSeriesNewArtworks_artistSeries$data } from "__generated__/ArtistSeriesNewArtworks_artistSeries.graphql"
import ArtworkGridItem from "app/Components/ArtworkGrids/ArtworkGridItem"
import { FilteredArtworkGridZeroState } from "app/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { extractNodes } from "app/utils/extractNodes"
import {
  ESTIMATED_MASONRY_ITEM_SIZE,
  NUM_COLUMNS_MASONRY,
  ON_END_REACHED_THRESHOLD_MASONRY,
} from "app/utils/masonryHelpers"
import { useCallback, useMemo, useRef } from "react"
import { FlatList } from "react-native-gesture-handler"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"

interface ArtistSeriesNewArtworksProps {
  artistSeries: ArtistSeriesNewArtworks_artistSeries$data
  relay: RelayPaginationProp
}

export const ArtistSeriesNewArtworks: React.FC<ArtistSeriesNewArtworksProps> = ({
  artistSeries,
  relay,
}) => {
  const { width } = useScreenDimensions()
  const space = useSpace()
  const artworks = extractNodes(artistSeries.artistSeriesArtworks)

  // create a variable called list with elements from artworks.length 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 etc
  const list = Array.from({ length: artworks.length }, (_, i) => i + 1)

  // console.warn({ artworks })

  const gridRef = useRef<MasonryFlashListRef<(typeof artworks)[0]>>(null)
  const shouldDisplaySpinner = !!artworks.length && !!relay.isLoading() && !!relay.hasMore()

  const renderItem = useCallback(({ item, index, columnIndex }) => {
    const imgAspectRatio = item.image?.aspectRatio ?? 1
    const imgWidth = width / NUM_COLUMNS_MASONRY - space(2) - space(1)
    const imgHeight = imgWidth / imgAspectRatio

    return (
      <Flex
        pl={columnIndex === 0 ? 0 : 1}
        pr={NUM_COLUMNS_MASONRY - (columnIndex + 1) === 0 ? 0 : 1}
        mt={2}
        height={20}
        width={20}
        backgroundColor="red100"
      >
        {/* <ArtworkGridItem itemIndex={index} artwork={item} height={imgHeight} /> */}
      </Flex>
    )
  }, [])

  const ListFooterComponenet = () => {
    if (shouldDisplaySpinner) {
      return (
        <Flex my={4} flexDirection="row" justifyContent="center">
          <Spinner />
        </Flex>
      )
    }

    return null
  }

  const loadMore = useCallback(() => {
    if (relay.hasMore() && !relay.isLoading()) {
      relay.loadMore(10)
    }
  }, [relay.hasMore(), relay.isLoading()])

  return (
    // <Tabs.Masonry
    //   data={artworks}
    //   numColumns={NUM_COLUMNS_MASONRY}
    //   estimatedItemSize={ESTIMATED_MASONRY_ITEM_SIZE}
    //   keyboardShouldPersistTaps="handled"
    //   innerRef={gridRef}
    //   ListEmptyComponent={
    //     <Box mb="80px" pt={2}>
    //       <FilteredArtworkGridZeroState
    //         id="artist.id"
    //         slug="artist.slug"
    //         // trackClear={trackClear}
    //         // hideClearButton={!appliedFilters.length}
    //       />
    //     </Box>
    //   }
    //   keyExtractor={(item) => item.id}
    //   renderItem={renderItem}
    //   onEndReached={loadMore}
    //   onEndReachedThreshold={ON_END_REACHED_THRESHOLD_MASONRY}
    //   // need to pass zIndex: 1 here in order for the SubTabBar to
    //   // be visible above list content
    //   ListHeaderComponentStyle={{ zIndex: 1 }}
    //   ListFooterComponent={<ListFooterComponenet />}
    // />
    <FlatList
      renderItem={renderItem}
      data={list}
      keyExtractor={(item) => item.id}
      onEndReached={loadMore}
      onEndReachedThreshold={ON_END_REACHED_THRESHOLD_MASONRY}
      ListFooterComponent={<ListFooterComponenet />}
    />
  )
}

export default createPaginationContainer(
  ArtistSeriesNewArtworks,
  {
    artistSeries: graphql`
      fragment ArtistSeriesNewArtworks_artistSeries on ArtistSeries
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 20 }
        cursor: { type: "String" }
        input: { type: "FilterArtworksInput" }
      ) {
        title
        slug
        internalID
        artistSeriesArtworks: filterArtworksConnection(
          first: $count
          after: $cursor
          input: $input
        ) @connection(key: "ArtistSeries_artistSeriesArtworks_artistSeriesArtworks") {
          counts {
            total
          }
          edges {

            node {
              id
              slug
              internalID
              image(includeAll: false) {
                aspectRatio
              }
              ...ArtworkGridItem_artwork @arguments(includeAllImages: false)
            }
          }
        }
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props?.artistSeries?.artistSeriesArtworks
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        ...props,
        id: props.artistSeries.slug,
        count,
        cursor,
        input: fragmentVariables.input,
      }
    },
    query: graphql`
      query ArtistSeriesNewArtworksPaginationQuery(
        $id: ID!
        $count: Int!
        $cursor: String
        $input: FilterArtworksInput
      ) {
        artistSeries(id: $id) {
          ...ArtistSeriesNewArtworks_artistSeries
            @arguments(count: $count, cursor: $cursor, input: $input)
        }
      }
    `,
  }
)
