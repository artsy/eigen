import { OwnerType } from "@artsy/cohesion"
import { Flex, Tabs, useScreenDimensions, useSpace } from "@artsy/palette-mobile"
import { SaleArtworks_viewer$key } from "__generated__/SaleArtworks_viewer.graphql"
import { ArtworkFilterNavigator, FilterModalMode } from "app/Components/ArtworkFilter"
import {
  filterArtworksParams,
  FilterParamName,
  prepareFilterArtworksParamsForInput,
  ViewAsValues,
} from "app/Components/ArtworkFilter/ArtworkFilterHelpers"
import { ArtworksFiltersStore } from "app/Components/ArtworkFilter/ArtworkFilterStore"
import { useArtworkFilters } from "app/Components/ArtworkFilter/useArtworkFilters"
import ArtworkGridItem from "app/Components/ArtworkGrids/ArtworkGridItem"
import { HeaderArtworksFilterWithTotalArtworks } from "app/Components/HeaderArtworksFilter/HeaderArtworksFilterWithTotalArtworks"
import { SaleArtworkListContainer } from "app/Scenes/Sale/Components/SaleArtworkList"
import { extractNodes } from "app/utils/extractNodes"
import {
  ESTIMATED_MASONRY_ITEM_SIZE,
  MASONRY_LIST_PAGE_SIZE,
  NUM_COLUMNS_MASONRY,
  ON_END_REACHED_THRESHOLD_MASONRY,
} from "app/utils/masonryHelpers"
import { Schema } from "app/utils/track"
import { FC, useCallback, useEffect, useState } from "react"
import { graphql, usePaginationFragment } from "react-relay"
import { useTracking } from "react-tracking"

interface SaleArtworksProps {
  viewer: SaleArtworks_viewer$key
}

export const SaleArtworks: FC<SaleArtworksProps> = ({ viewer }) => {
  const { data, loadNext, hasNext, isLoadingNext, refetch } = usePaginationFragment(
    fragment,
    viewer
  )
  const space = useSpace()
  const { width } = useScreenDimensions()
  const tracking = useTracking()
  const [isFilterArtworksModalVisible, setFilterArtworkModalVisible] = useState(false)
  const appliedFiltersState = ArtworksFiltersStore.useStoreState((state) => state.appliedFilters)
  const filterTypeState = ArtworksFiltersStore.useStoreState((state) => state.filterType)
  const setFiltersCountAction = ArtworksFiltersStore.useStoreActions(
    (action) => action.setFiltersCountAction
  )
  const setFilterTypeAction = ArtworksFiltersStore.useStoreActions(
    (action) => action.setFilterTypeAction
  )
  const filterParams = filterArtworksParams(appliedFiltersState, filterTypeState)
  const viewAsFilter = appliedFiltersState.find(
    (filter) => filter.paramName === FilterParamName.viewAs
  )

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    setFilterTypeAction("newSaleArtwork")

    if (data?.unfilteredArtworksConnection?.counts) {
      setFiltersCountAction(data.unfilteredArtworksConnection.counts)
    }
  }, [data?.unfilteredArtworksConnection?.counts, setFiltersCountAction, setFilterTypeAction])

  const input = prepareFilterArtworksParamsForInput(filterParams)
  const refetchVariables = {
    input: {
      priceRange: filterParams.estimateRange,
      ...input,
    },
  }
  useArtworkFilters({
    aggregations: data?.artworksConnection?.aggregations,
    componentPath: "Sale/SaleArtworks",
    refetchVariables,
    refetch,
  })

  const loadMore = useCallback(() => {
    if (hasNext && !isLoadingNext) {
      loadNext(MASONRY_LIST_PAGE_SIZE)
    }
  }, [hasNext, isLoadingNext, loadNext])

  if (!data?.artworksConnection) {
    return null
  }

  const openFilterArtworksModal = () => {
    tracking.trackEvent(tracks.openFilter(data.sale.internalID, data.sale.slug))
    setFilterArtworkModalVisible(true)
  }

  const closeFilterArtworksModal = () => {
    tracking.trackEvent(tracks.closeFilter(data.sale.internalID, data.sale.slug))
    setFilterArtworkModalVisible(false)
  }

  const artworks = extractNodes(data.artworksConnection)

  if (viewAsFilter?.paramValue === ViewAsValues.List) {
    return (
      <SaleArtworkListContainer
        connection={data.artworksConnection}
        hasMore={() => hasNext}
        loadMore={loadMore}
        isLoading={() => isLoadingNext}
        contextScreenOwnerType={OwnerType.sale}
        contextScreenOwnerId={data.sale.internalID}
        contextScreenOwnerSlug={data.sale.slug}
      />
    )
  }

  return (
    <>
      <Tabs.Masonry
        data={artworks}
        numColumns={NUM_COLUMNS_MASONRY}
        estimatedItemSize={ESTIMATED_MASONRY_ITEM_SIZE}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item, index, columnIndex }) => {
          const imgAspectRatio = item.image?.aspectRatio ?? 1
          const imgWidth = width / NUM_COLUMNS_MASONRY - space(2) - space(1)
          const imgHeight = imgWidth / imgAspectRatio

          return (
            <Flex
              pl={columnIndex === 0 ? 0 : 1}
              pr={NUM_COLUMNS_MASONRY - (columnIndex + 1) === 0 ? 0 : 1}
              mt={2}
            >
              <ArtworkGridItem
                itemIndex={index}
                contextScreenOwnerType={OwnerType.sale}
                contextScreenOwnerId={data.sale.internalID}
                contextScreenOwnerSlug={data.sale.slug}
                artwork={item}
                height={imgHeight}
              />
            </Flex>
          )
        }}
        keyExtractor={(item) => item.id}
        onEndReached={loadMore}
        onEndReachedThreshold={ON_END_REACHED_THRESHOLD_MASONRY}
        ListHeaderComponent={
          <>
            <Tabs.SubTabBar>
              <HeaderArtworksFilterWithTotalArtworks onPress={openFilterArtworksModal} />
            </Tabs.SubTabBar>
          </>
        }
        ListHeaderComponentStyle={{ zIndex: 1 }}
      />

      <ArtworkFilterNavigator
        id={data.sale.internalID}
        slug={data.sale.slug}
        visible={!!isFilterArtworksModalVisible}
        name={data.sale.name}
        exitModal={closeFilterArtworksModal}
        closeModal={closeFilterArtworksModal}
        mode={FilterModalMode.SaleArtworks}
      />
    </>
  )
}

const fragment = graphql`
  fragment SaleArtworks_viewer on Viewer
  @refetchable(queryName: "SaleWithTabsPaginationQuery")
  @argumentDefinitions(
    saleID: { type: "ID!" }
    saleIDString: { type: "String!" }
    count: { type: "Int", defaultValue: 10 }
    cursor: { type: "String" }
    input: { type: "FilterArtworksInput" }
  ) {
    sale(id: $saleIDString) @required(action: NONE) {
      internalID @required(action: NONE)
      slug @required(action: NONE)
      name @required(action: NONE)
    }
    unfilteredArtworksConnection: artworksConnection(
      saleID: $saleID
      first: 1
      aggregations: [TOTAL, FOLLOWED_ARTISTS, ARTIST, MEDIUM]
    ) {
      counts {
        followedArtists
        total
      }
    }
    artworksConnection(
      saleID: $saleID
      first: $count
      after: $cursor
      input: $input
      aggregations: [TOTAL, FOLLOWED_ARTISTS, ARTIST, MEDIUM]
    ) @connection(key: "SaleLotsListViewer_artworksConnection") {
      aggregations {
        slice
        counts {
          count
          name
          value
        }
      }
      counts {
        total
        followedArtists
      }
      edges {
        node {
          ...ArtworkGridItem_artwork @arguments(includeAllImages: false)
          id
          slug
          image(includeAll: false) {
            aspectRatio
          }
        }
      }
    }
  }
`

export const tracks = {
  openFilter: (id: string, slug: string) => {
    return {
      action_name: "filter",
      context_screen_owner_type: Schema.OwnerEntityTypes.Auction,
      context_screen: Schema.PageNames.Auction,
      context_screen_owner_id: id,
      context_screen_owner_slug: slug,
      action_type: Schema.ActionTypes.Tap,
    }
  },
  closeFilter: (id: string, slug: string) => {
    return {
      action_name: "closeFilterWindow",
      context_screen_owner_type: Schema.OwnerEntityTypes.Auction,
      context_screen: Schema.PageNames.Auction,
      context_screen_owner_id: id,
      context_screen_owner_slug: slug,
      action_type: Schema.ActionTypes.Tap,
    }
  },
}
