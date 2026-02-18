import { OwnerType } from "@artsy/cohesion"
import { Box, Flex, Tabs, useScreenDimensions, useSpace } from "@artsy/palette-mobile"
import { MasonryListRenderItem } from "@shopify/flash-list"
import { PartnerArtwork_partner$data } from "__generated__/PartnerArtwork_partner.graphql"
import { ArtworkFilterNavigator, FilterModalMode } from "app/Components/ArtworkFilter"
import {
  useArtworkFilters,
  useSelectedFiltersCount,
} from "app/Components/ArtworkFilter/useArtworkFilters"
import ArtworkGridItem from "app/Components/ArtworkGrids/ArtworkGridItem"
import { ArtworksFilterHeader } from "app/Components/ArtworkGrids/ArtworksFilterHeader"
import { TabEmptyState } from "app/Components/TabEmptyState"
import { extractNodes } from "app/utils/extractNodes"

import {
  ESTIMATED_MASONRY_ITEM_SIZE,
  MASONRY_LIST_PAGE_SIZE,
  NUM_COLUMNS_MASONRY,
  ON_END_REACHED_THRESHOLD_MASONRY,
} from "app/utils/masonryHelpers"
import { AnimatedMasonryListFooter } from "app/utils/masonryHelpers/AnimatedMasonryListFooter"
import { ExtractNodeType } from "app/utils/relayHelpers"
import React, { useCallback, useState } from "react"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"

type PartnerArtworkType = ExtractNodeType<NonNullable<PartnerArtwork_partner$data["artworks"]>>

export const PartnerArtwork: React.FC<{
  partner: PartnerArtwork_partner$data
  relay: RelayPaginationProp
}> = ({ partner, relay }) => {
  const [isFilterArtworksModalVisible, setIsFilterArtworksModalVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const space = useSpace()
  const { width } = useScreenDimensions()

  useArtworkFilters({
    relay,
    aggregations: partner.artworks?.aggregations,
    componentPath: "PartnerArtwork/PartnerArtwork",
    pageSize: MASONRY_LIST_PAGE_SIZE,
  })
  const appliedFiltersCount = useSelectedFiltersCount()

  const artworks = extractNodes(partner.artworks)

  const loadMore = useCallback(() => {
    if (relay.hasMore() && !relay.isLoading()) {
      // IMPORTANT: this is a workaround to show the spinner concistently between refetches of pages
      // and it is not needed for grids that use relay hooks since isLoadingNext works better than the
      // legacy container API. See FairArtworks.tsx for an example of how to use with relay hooks.
      setIsLoading(true)
      relay.loadMore(MASONRY_LIST_PAGE_SIZE, () => {
        setIsLoading(false)
      })
    }
  }, [relay.hasMore(), relay.isLoading()])

  const shouldDisplaySpinner =
    !!isLoading && !!artworks.length && !!relay.isLoading() && !!relay.hasMore()

  const emptyText =
    "There are no matching works from this gallery.\nTry changing your search filters"

  const renderItem: MasonryListRenderItem<PartnerArtworkType> = useCallback(
    ({ item, columnIndex }) => {
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
            contextScreenOwnerType={OwnerType.partner}
            contextScreenOwnerId={partner.internalID}
            contextScreenOwnerSlug={partner.slug}
            artwork={item}
            height={imgHeight}
          />
        </Flex>
      )
    },
    []
  )

  return (
    <>
      <Tabs.Masonry
        data={artworks}
        numColumns={NUM_COLUMNS_MASONRY}
        estimatedItemSize={ESTIMATED_MASONRY_ITEM_SIZE}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <Box mb="80px" pt={2}>
            <TabEmptyState text={emptyText} />
          </Box>
        }
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onEndReached={loadMore}
        onEndReachedThreshold={ON_END_REACHED_THRESHOLD_MASONRY}
        ListFooterComponent={() => (
          <AnimatedMasonryListFooter shouldDisplaySpinner={shouldDisplaySpinner} />
        )}
        // need to pass zIndex: 1 here in order for the SubTabBar to
        // be visible above list content
        ListHeaderComponentStyle={{ zIndex: 1 }}
        ListHeaderComponent={
          <Tabs.SubTabBar>
            <ArtworksFilterHeader
              selectedFiltersCount={appliedFiltersCount}
              onFilterPress={() => setIsFilterArtworksModalVisible(true)}
            />
          </Tabs.SubTabBar>
        }
      />

      <ArtworkFilterNavigator
        visible={isFilterArtworksModalVisible}
        id={partner.internalID}
        slug={partner.slug}
        mode={FilterModalMode.Partner}
        exitModal={() => {
          setIsFilterArtworksModalVisible(false)
        }}
        closeModal={() => {
          setIsFilterArtworksModalVisible(false)
        }}
      />
    </>
  )
}

export const PartnerArtworkFragmentContainer = createPaginationContainer(
  PartnerArtwork,
  {
    partner: graphql`
      fragment PartnerArtwork_partner on Partner
      @argumentDefinitions(
        # 10 matches the PAGE_SIZE constant. This is required. See MX-316 for follow-up.
        count: { type: "Int", defaultValue: 10 }
        cursor: { type: "String" }
        input: { type: "FilterArtworksInput" }
      ) {
        internalID
        slug
        artworks: filterArtworksConnection(
          first: $count
          after: $cursor
          aggregations: [ARTIST, MAJOR_PERIOD, MEDIUM, MATERIALS_TERMS, ARTIST_NATIONALITY]
          input: $input
        ) @connection(key: "Partner_artworks") {
          aggregations {
            slice
            counts {
              name
              value
            }
          }
          edges {
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
    `,
  },
  {
    getConnectionFromProps(props) {
      return props.partner && props.partner.artworks
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        input: fragmentVariables.input,
        id: props.partner.internalID,
        count,
        cursor,
      }
    },
    query: graphql`
      query PartnerArtworkInfiniteScrollGridQuery(
        $id: String!
        $count: Int!
        $cursor: String
        $input: FilterArtworksInput
      ) {
        partner(id: $id) {
          ...PartnerArtwork_partner @arguments(count: $count, cursor: $cursor, input: $input)
        }
      }
    `,
  }
)
