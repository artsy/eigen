import { OwnerType } from "@artsy/cohesion"
import {
  Box,
  Text,
  SimpleMessage,
  Tabs,
  useScreenDimensions,
  Flex,
  useSpace,
} from "@artsy/palette-mobile"
import { TagArtworks_tag$data } from "__generated__/TagArtworks_tag.graphql"
import { ArtworkFilterNavigator } from "app/Components/ArtworkFilter"
import { FilterModalMode } from "app/Components/ArtworkFilter/ArtworkFilterOptionsScreen"
import { useArtworkFilters } from "app/Components/ArtworkFilter/useArtworkFilters"
import ArtworkGridItem from "app/Components/ArtworkGrids/ArtworkGridItem"
import { FilteredArtworkGridZeroState } from "app/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { TagArtworksFilterHeader } from "app/Scenes/Tag/TagArtworksFilterHeader"
import { extractNodes } from "app/utils/extractNodes"
import {
  ESTIMATED_MASONRY_ITEM_SIZE,
  MASONRY_LIST_PAGE_SIZE,
  NUM_COLUMNS_MASONRY,
  ON_END_REACHED_THRESHOLD_MASONRY,
} from "app/utils/masonryHelpers"
import { AnimatedMasonryListFooter } from "app/utils/masonryHelpers/AnimatedMasonryListFooter"
import { Schema } from "app/utils/track"
import React, { useCallback, useRef, useState } from "react"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { useTracking } from "react-tracking"

interface TagArtworksProps {
  tag?: TagArtworks_tag$data | null
  relay: RelayPaginationProp
}

const TagArtworks: React.FC<TagArtworksProps> = ({ tag, relay }) => {
  const tracking = useTracking()
  const space = useSpace()
  const [isFilterArtworksModalVisible, setFilterArtworkModalVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { width } = useScreenDimensions()
  const artworksTotal = tag?.artworks?.counts?.total ?? 0
  const initialArtworksTotal = useRef(artworksTotal)
  const artworks = extractNodes(tag?.artworks) ?? []
  const shouldDisplaySpinner =
    !!isLoading && !!artworks.length && !!relay.isLoading() && !!relay.hasMore()

  const trackClear = () => {
    if (tag?.id && tag?.slug) {
      tracking.trackEvent(tracks.clearFilters(tag.id, tag.slug))
    }
  }

  useArtworkFilters({
    relay,
    aggregations: tag?.artworks?.aggregations,
    componentPath: "Tag/TagArtworks",
    pageSize: MASONRY_LIST_PAGE_SIZE,
  })

  const handleCloseFilterArtworksModal = () => setFilterArtworkModalVisible(false)
  const handleOpenFilterArtworksModal = () => setFilterArtworkModalVisible(true)

  const openFilterArtworksModal = () => {
    if (tag?.id && tag?.slug) {
      tracking.trackEvent(tracks.openFilterWindow(tag.id, tag.slug))
      handleOpenFilterArtworksModal()
    }
  }

  const closeFilterArtworksModal = () => {
    if (tag?.id && tag?.slug) {
      tracking.trackEvent(tracks.closeFilterWindow(tag.id, tag.slug))
      handleCloseFilterArtworksModal()
    }
  }

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

  const renderItem = useCallback(({ item, columnIndex }) => {
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
          contextScreenOwnerType={OwnerType.tag}
          contextScreenOwnerId={tag?.internalID}
          contextScreenOwnerSlug={tag?.slug}
          artwork={item}
          height={imgHeight}
        />
      </Flex>
    )
  }, [])

  return (
    <>
      <Tabs.Masonry
        data={artworks}
        numColumns={NUM_COLUMNS_MASONRY}
        estimatedItemSize={ESTIMATED_MASONRY_ITEM_SIZE}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          initialArtworksTotal ? (
            <Box mt={1}>
              <SimpleMessage>
                There aren’t any works available in the tag at this time.
              </SimpleMessage>
            </Box>
          ) : (
            <Box pt={1}>
              <FilteredArtworkGridZeroState id={tag?.id} slug={tag?.slug} trackClear={trackClear} />
            </Box>
          )
        }
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onEndReached={loadMore}
        onEndReachedThreshold={ON_END_REACHED_THRESHOLD_MASONRY}
        ListFooterComponent={
          <AnimatedMasonryListFooter shouldDisplaySpinner={shouldDisplaySpinner} />
        }
        // need to pass zIndex: 1 here in order for the SubTabBar to
        // be visible above list content
        ListHeaderComponentStyle={{ zIndex: 1 }}
        ListHeaderComponent={
          <>
            <Tabs.SubTabBar>
              <TagArtworksFilterHeader openFilterArtworksModal={openFilterArtworksModal} />
            </Tabs.SubTabBar>
            <Flex pt={1} backgroundColor="mono0">
              <Text variant="xs" color="mono60">
                Showing {artworksTotal} works
              </Text>
            </Flex>
          </>
        }
      />
      <ArtworkFilterNavigator
        id={tag?.internalID}
        slug={tag?.slug}
        visible={isFilterArtworksModalVisible}
        exitModal={handleCloseFilterArtworksModal}
        closeModal={closeFilterArtworksModal}
        mode={FilterModalMode.Tag}
      />
    </>
  )
}

export const TagArtworksPaginationContainer = createPaginationContainer(
  TagArtworks,
  {
    tag: graphql`
      fragment TagArtworks_tag on Tag
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 10 }
        cursor: { type: "String", defaultValue: "" }
        input: { type: "FilterArtworksInput" }
      ) {
        id
        internalID
        slug
        artworks: filterArtworksConnection(
          first: $count
          after: $cursor
          aggregations: [
            LOCATION_CITY
            ARTIST_NATIONALITY
            PRICE_RANGE
            COLOR
            DIMENSION_RANGE
            PARTNER
            MAJOR_PERIOD
            MEDIUM
            PRICE_RANGE
            ARTIST
            LOCATION_CITY
            MATERIALS_TERMS
          ]
          input: $input
        ) @connection(key: "TagArtworksGrid_artworks") {
          counts {
            total
          }
          aggregations {
            slice
            counts {
              value
              name
              count
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
      return props?.tag?.artworks
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        input: fragmentVariables.input,
        id: props?.tag?.slug,
        count,
        cursor,
      }
    },
    query: graphql`
      query TagArtworksPaginationQuery(
        $id: String!
        $count: Int!
        $cursor: String
        $input: FilterArtworksInput
      ) {
        tag(id: $id) {
          ...TagArtworks_tag @arguments(count: $count, cursor: $cursor, input: $input)
        }
      }
    `,
  }
)

export const tracks = {
  clearFilters: (id: string, slug: string) => ({
    action_name: "clearFilters",
    context_screen: Schema.ContextModules.ArtworkGrid,
    context_screen_owner_type: Schema.OwnerEntityTypes.Tag,
    context_screen_owner_id: id,
    context_screen_owner_slug: slug,
    action_type: Schema.ActionTypes.Tap,
  }),
  openFilterWindow: (id: string, slug: string) => ({
    action_name: "filter",
    context_screen_owner_type: Schema.OwnerEntityTypes.Tag,
    context_screen: Schema.PageNames.TagPage,
    context_screen_owner_id: id,
    context_screen_owner_slug: slug,
    action_type: Schema.ActionTypes.Tap,
  }),
  closeFilterWindow: (id: string, slug: string) => ({
    action_name: "closeFilterWindow",
    context_screen_owner_type: Schema.OwnerEntityTypes.Tag,
    context_screen: Schema.PageNames.TagPage,
    context_screen_owner_id: id,
    context_screen_owner_slug: slug,
    action_type: Schema.ActionTypes.Tap,
  }),
}
