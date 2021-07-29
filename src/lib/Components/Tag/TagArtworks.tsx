import { TagArtworks_tag } from "__generated__/TagArtworks_tag.graphql"
import { FilteredArtworkGridZeroState } from "lib/Components/ArtworkGrids/FilteredArtworkGridZeroState"
import { ArtworksFilterHeader } from "lib/Components/ArtworkGrids/FilterHeader"
import { InfiniteScrollArtworksGridContainer } from "lib/Components/ArtworkGrids/InfiniteScrollArtworksGrid"
import { PAGE_SIZE } from "lib/data/constants"
import { Schema } from "lib/utils/track"
import { Box, Message, Separator } from "palette"
import React, { useContext, useRef, useState } from "react"
import { useEffect } from "react"
import { createPaginationContainer, graphql, RelayPaginationProp } from "react-relay"
import { useTracking } from "react-tracking"
import { ArtworkFilterNavigator } from "../ArtworkFilter/ArtworkFilter"
import { filterArtworksParams, prepareFilterArtworksParamsForInput } from "../ArtworkFilter/ArtworkFilterHelpers"
import { FilterModalMode } from "../ArtworkFilter/ArtworkFilterOptionsScreen"
import { ArtworkFiltersStoreProvider, ArtworksFiltersStore } from "../ArtworkFilter/ArtworkFilterStore"
import { StickyTabPageFlatListContext } from "../StickyTabPage/StickyTabPageFlatList"
import { StickyTabPageScrollView } from "../StickyTabPage/StickyTabPageScrollView"

interface TagArtworksContainerProps {
  tag: TagArtworks_tag
  relay: RelayPaginationProp
}

interface TagArtworksProps extends TagArtworksContainerProps {
  openFilterModal: () => void
}

export const TagArtworks: React.FC<TagArtworksProps> = (props) => {
  const { tag, relay, openFilterModal } = props
  const tracking = useTracking()
  const setAggregationsAction = ArtworksFiltersStore.useStoreActions((state) => state.setAggregationsAction)
  const appliedFilters = ArtworksFiltersStore.useStoreState((state) => state.appliedFilters)
  const applyFilters = ArtworksFiltersStore.useStoreState((state) => state.applyFilters)
  const filterParams = filterArtworksParams(appliedFilters, "tagArtwork")
  const artworksTotal = tag.artworks?.counts?.total ?? 0
  const initialArtworksTotal = useRef(artworksTotal)

  const setJSX = useContext(StickyTabPageFlatListContext).setJSX

  const trackClear = () => {
    tracking.trackEvent(tracks.clearFilters(tag.id, tag.slug))
  }

  useEffect(() => {
    if (applyFilters) {
      relay.refetchConnection(
        PAGE_SIZE,
        (error) => {
          if (error) {
            throw new Error("Tag/TagArtworks filter error: " + error.message)
          }
        },
        { input: prepareFilterArtworksParamsForInput(filterParams) }
      )
    }
  }, [appliedFilters])

  useEffect(() => {
    if (tag.artworks?.aggregations) {
      setAggregationsAction(tag.artworks.aggregations)
    }
  }, [])

  useEffect(() => {
    setJSX(
      <Box backgroundColor="white">
        <ArtworksFilterHeader count={artworksTotal} onFilterPress={openFilterModal} />
        <Separator />
      </Box>
    )
  }, [artworksTotal, openFilterModal])

  if (initialArtworksTotal.current === 0) {
    return (
      <Box mt={1}>
        <Message>There aren’t any works available in the tag at this time.</Message>
      </Box>
    )
  }

  if (artworksTotal === 0) {
    return (
      <Box pt={1}>
        <FilteredArtworkGridZeroState id={tag.id} slug={tag.slug} trackClear={trackClear} />
      </Box>
    )
  }

  return (
    <Box>
      <Box mt={1} mx={1}>
        <InfiniteScrollArtworksGridContainer
          connection={tag.artworks!}
          hasMore={props.relay.hasMore}
          loadMore={props.relay.loadMore}
        />
      </Box>
    </Box>
  )
}

const TagArtworksContainer: React.FC<TagArtworksContainerProps> = (props) => {
  const { tag } = props
  const tracking = useTracking()
  const [isFilterArtworksModalVisible, setFilterArtworkModalVisible] = useState(false)

  const handleCloseFilterArtworksModal = () => setFilterArtworkModalVisible(false)
  const handleOpenFilterArtworksModal = () => setFilterArtworkModalVisible(true)

  const openFilterArtworksModal = () => {
    tracking.trackEvent(tracks.openFilterWindow(tag.id, tag.slug))
    handleOpenFilterArtworksModal()
  }

  const closeFilterArtworksModal = () => {
    tracking.trackEvent(tracks.closeFilterWindow(tag.id, tag.slug))
    handleCloseFilterArtworksModal()
  }

  return (
    <ArtworkFiltersStoreProvider>
      <StickyTabPageScrollView>
        <TagArtworks {...props} openFilterModal={openFilterArtworksModal} />
        <ArtworkFilterNavigator
          {...props}
          id={tag.internalID}
          slug={tag.slug}
          isFilterArtworksModalVisible={isFilterArtworksModalVisible}
          exitModal={handleCloseFilterArtworksModal}
          closeModal={closeFilterArtworksModal}
          mode={FilterModalMode.Tag}
        />
      </StickyTabPageScrollView>
    </ArtworkFiltersStoreProvider>
  )
}

export const TagArtworksPaginationContainer = createPaginationContainer(
  TagArtworksContainer,
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
            MEDIUM
            LOCATION_CITY
            PRICE_RANGE
            MATERIALS_TERMS
            PARTNER
            ARTIST_NATIONALITY
            MAJOR_PERIOD
            ARTIST
            TOTAL
          ]
          forSale: true
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
            }
          }
          ...InfiniteScrollArtworksGrid_connection
        }
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props.tag.artworks
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        input: fragmentVariables.input,
        id: props.tag.slug,
        count,
        cursor,
      }
    },
    query: graphql`
      query TagArtworksPaginationQuery($id: String!, $count: Int!, $cursor: String, $input: FilterArtworksInput) {
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
